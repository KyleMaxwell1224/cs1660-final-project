import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.StringTokenizer;
import java.util.TreeMap;
import java.util.TreeSet;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.LongWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;


public class TopN {
    final static String[] stoplist_words = {"a", "about", "above", "after", "again", "against", "all", "am", "an", "and", "any", "are", "aren't", "as", "at", "be", "because", "been", "before", "being", "below", "between", "both", "but", "by", "can't", "cannot", "could", "couldn't", "did", "didn't", "do", "does", "doesn't", "doing", "don't", "down", "during", "each", "few", "for", "from", "further", "had", "hadn't", "has", "hasn't", "have", "haven't", "having", "he", "he'd", "he'll", "he's", "her", "here", "here's", "hers", "herself", "him", "himself", "his", "how", "how's", "i", "i'd", "i'll", "i'm", "i've", "if", "in", "into", "is", "isn't", "it", "it's", "its", "itself", "let's", "me", "more", "most", "mustn't", "my", "myself", "no", "nor", "not", "of", "off", "on", "once", "only", "or", "other", "ought", "our", "ours", "ourselves", "out", "over", "own", "same", "shan't", "she", "she'd", "she'll", "she's", "should", "shouldn't", "so", "some", "such", "than", "that", "that's", "the", "their", "theirs", "them", "themselves", "then", "there", "there's", "these", "they", "they'd", "they'll", "they're", "they've", "this", "those", "through", "to", "too", "under", "until", "up", "very", "was", "wasn't", "we", "we'd", "we'll", "we're", "we've", "were", "weren't"};
    public final static List<String> STOPLIST = Arrays.asList(stoplist_words);
    public static class TopNMapper extends Mapper<Object, Text, Text, LongWritable> {

        private TreeMap<Long, String> topFiveSet;
  
        @Override
        public void setup(Context context) throws IOException,
                                         InterruptedException
        {
            topFiveSet = new TreeMap<Long, String>();
        }

    
        @Override
        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            Configuration conf = context.getConfiguration();
            String topN = conf.get("topN");
            System.out.println("topN: " + topN);
            Integer n = Integer.parseInt(topN);
            String[] tokens =  value.toString().split("\t");
            String word = tokens[0];
            if (STOPLIST.contains(word)) {
                return;
            }
            long count = Long.parseLong(tokens[1]);
            topFiveSet.put(count, word);
            if (topFiveSet.size() > n) {
                topFiveSet.remove(topFiveSet.firstKey());
            }
        }
        @Override
        public void cleanup(Context context) throws IOException, InterruptedException {
        
            for (Map.Entry<Long, String> entry : topFiveSet.entrySet()) 
            {
                long count = entry.getKey();
                String name = entry.getValue();
                context.write(new Text(name), new LongWritable(count));
            }
                                      
         }
        
    }

    public static class TopNReducer extends Reducer<Text, LongWritable, LongWritable, Text> {
        private TreeMap<Long, String> topFiveSet;
  
        @Override
        public void setup(Context context) throws IOException,
                                         InterruptedException
        {
            topFiveSet = new TreeMap<Long, String>(Collections.reverseOrder());
        }

        @Override
        public void reduce(Text key, Iterable<LongWritable> values,
          Context context) throws IOException, InterruptedException
        {
            Configuration conf = context.getConfiguration();
            Integer n = Integer.parseInt(conf.get("topN"));
            String name = key.toString();
            long count = 0;
  
            for (LongWritable val : values)
            {
                count = val.get();
            }
      
            topFiveSet.put(count, name);
            if (topFiveSet.size() > n)
            {
                topFiveSet.remove(topFiveSet.firstKey());
            }
        }
        @Override
        public void cleanup(Context context) throws IOException,
                                           InterruptedException
        {
            Configuration conf = context.getConfiguration();
            Integer n = Integer.parseInt(conf.get("topN"));

            for (Map.Entry<Long, String> entry : topFiveSet.entrySet()) 
            {
                Long count = entry.getKey();
                String word = entry.getValue();
                context.write(new LongWritable(count), new Text(word));
            }
        }        
    }
    public static void main(String[] args) throws Exception{
        Configuration conf = new Configuration();
        String topN = args[2];
        conf.set("topN", topN);
        Job job = Job.getInstance(conf, "Top N");
        job.setJarByClass(TopN.class);
        job.setMapperClass(TopNMapper.class);
        job.setReducerClass(TopNReducer.class);

        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(LongWritable.class);
  
        job.setOutputKeyClass(LongWritable.class);
        job.setOutputValueClass(Text.class);
        
        job.setNumReduceTasks(1);
        
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));

        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}