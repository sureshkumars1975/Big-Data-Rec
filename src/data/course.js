export const COURSE = {
  title: 'Big Data Architecture',
  level: 'Beginner to Intermediate',
  duration: '10 Weeks · 175 Hours',
  objectives: [
    'Learn the fundamentals of data science and big data.',
    'Gain in-depth knowledge of descriptive data analytical techniques.',
    'Implement simple to complex analytical algorithms in big data frameworks.',
    'Develop programming skills using Python libraries and packages for data analysis.',
    'Understand and perform data visualization, web scraping, machine learning and NLP using Data Science tools.',
  ],
}

// color keys map to CSS vars: --teal, --amber, --coral, --violet, --blue
export const UNITS = [
  {
    id: 'unit-1',
    number: 1,
    slug: 'introduction-to-big-data',
    color: 'teal',
    title: 'Introduction to Big Data',
    tagline: 'Digital data, the 3Vs, CAP theorem and the vocabulary of the field',
    weeks: 'Weeks 1–2',
  },
  {
    id: 'unit-2',
    number: 2,
    slug: 'hadoop-and-mapreduce',
    color: 'amber',
    title: 'Hadoop & MapReduce',
    tagline: 'HDFS architecture and the Map → Combine → Shuffle → Reduce pipeline',
    weeks: 'Weeks 3–4',
  },
  {
    id: 'unit-3',
    number: 3,
    slug: 'nosql-databases',
    color: 'coral',
    title: 'NoSQL Databases',
    tagline: 'MongoDB documents and Cassandra wide-column stores, hands-on',
    weeks: 'Weeks 5–6',
  },
  {
    id: 'unit-4',
    number: 4,
    slug: 'hive-and-pig',
    color: 'violet',
    title: 'Hadoop Ecosystem: Hive & Pig',
    tagline: 'SQL-on-Hadoop with Hive and dataflow scripting with Pig Latin',
    weeks: 'Weeks 7–8',
  },
  {
    id: 'unit-5',
    number: 5,
    slug: 'apache-spark',
    color: 'blue',
    title: 'Apache Spark',
    tagline: 'Cluster architecture, lazy evaluation, partitions and DataFrames',
    weeks: 'Weeks 9–10',
  },
]
