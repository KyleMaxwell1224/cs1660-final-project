import java.io.IOException;
import java.util.Collections;
import java.util.Comparator;
import java.util.Map;
import java.util.SortedSet;
import java.util.StringTokenizer;
import java.util.TreeMap;
import java.util.TreeSet;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.fs.Path;
import org.apache.hadoop.io.IntWritable;
import org.apache.hadoop.io.Text;
import org.apache.hadoop.mapreduce.Job;
import org.apache.hadoop.mapreduce.Mapper;
import org.apache.hadoop.mapreduce.Reducer;
import org.apache.hadoop.mapreduce.lib.input.FileInputFormat;
import org.apache.hadoop.mapreduce.lib.output.FileOutputFormat;


public class TopN {

    public static class TopNMapper extends Mapper<Object, Text, Text, IntWritable> {
        
        static <K,V extends Comparable<? super V>>
        SortedSet<Map.Entry<K,V>> entriesSortedByValues(Map<K,V> map) {
            SortedSet<Map.Entry<K,V>> sortedEntries = new TreeSet<Map.Entry<K,V>>(
                new Comparator<Map.Entry<K,V>>() {
                    @Override public int compare(Map.Entry<K,V> e1, Map.Entry<K,V> e2) {
                        int res = e1.getValue().compareTo(e2.getValue());
                        return res != 0 ? res : 1;
                    }
                }
            );
            sortedEntries.addAll(map.entrySet());
            return sortedEntries;
        }

        private Map<String, Integer> topFiveSet;
  
        @Override
        public void setup(Context context) throws IOException,
                                         InterruptedException
        {
            topFiveSet = new TreeMap<String, Integer>();
        }

    
        @Override
        public void map(Object key, Text value, Context context) throws IOException, InterruptedException {
            StringTokenizer itr = new StringTokenizer(value.toString());
            while (itr.hasMoreTokens()) {
                String token = itr.nextToken();
                if (topFiveSet.containsKey(token))
                    topFiveSet.put(token, topFiveSet.get(token)+1);
                else
                    topFiveSet.put(token, 1);
            }
            
        }
        @Override
        public void cleanup(Context context) throws IOException,
                                           InterruptedException
        {

            for (Map.Entry<String, Integer> entry : entriesSortedByValues(topFiveSet)) 
            {
                String word = entry.getKey();
                Integer value = entry.getValue();
                context.write(new Text(word), new IntWritable(value));
            }
        }        
    }

    public static class TopNReducer extends Reducer<Text, IntWritable, IntWritable, Text> {
        private TreeMap<Integer, String> topFiveSet;
  
        @Override
        public void setup(Context context) throws IOException,
                                         InterruptedException
        {
            topFiveSet = new TreeMap<Integer, String>(Collections.reverseOrder());
        }

        @Override
        public void reduce(Text key, Iterable<IntWritable> values,
          Context context) throws IOException, InterruptedException
        {

            String name = key.toString();
            Integer count = 0;
      
            for (IntWritable val : values)
            {
                count = val.get();
            }
      
            topFiveSet.put(count, name);
        }
        @Override
        public void cleanup(Context context) throws IOException,
                                           InterruptedException
        {
            int topFiveAdded = 0;
            Configuration conf = context.getConfiguration();
            Integer n = conf.get("n");

            for (Map.Entry<Integer, String> entry : topFiveSet.entrySet()) 
            {
                if (topFiveAdded == n)
                    break;
                Integer count = entry.getKey();
                String word = entry.getValue();
                context.write(new IntWritable(count), new Text(word));
                topFiveAdded++;
            }
        }        
    }
    public static void main(String[] args) throws Exception{
        Configuration conf = new Configuration();
        Job job = Job.getInstance(conf, "Top N");
        job.setJarByClass(TopN.class);
        job.setMapperClass(TopNMapper.class);
        job.setReducerClass(TopNReducer.class);

        job.setMapOutputKeyClass(Text.class);
        job.setMapOutputValueClass(IntWritable.class);
  
        job.setOutputKeyClass(IntWritable.class);
        job.setOutputValueClass(Text.class);
        
        job.setNumReduceTasks(1);
        
        FileInputFormat.addInputPath(job, new Path(args[0]));
        FileOutputFormat.setOutputPath(job, new Path(args[1]));
        Integer n = Integer.parseInt( args[2] );
        conf.set("n", n);

        System.exit(job.waitForCompletion(true) ? 0 : 1);
    }
}