# News Parser
Parse and Scrape popular vietnamese news site data. 

To gather data for, in aggregation with SamSon Hotel's proprietary client access data, data analytics and machine learning purposes.

This lambda is to fetch and send raw json data to s3 bucket

structure: 
  source: 
    - array of rss feed urls 
  data: 
    - [sitename].[category].data => general url site data (article links, urls, title, description)

  VNEXPRESS data format:
    rss:
      $ => header
      channel: [0] => object
        {
          title:       [0] => string 
          description: [0] => string
          image:       [0] => object
            {
              url   [0] : image_url_string
              title [0] : string
              link  [0] : url_string
            }
          pubDate: [0] => date_string
          item: [*] => array_articles
            {
              title            [0]: string
              description      [0]: description_string 
              pubDate:         [0]: date_string
              guid:            [0]: string_guid => similar to url
              "slash:comments" [0]: number_string => amount of comments
            }
        }
    

  DANTRI data format:
    rss:
      $ => header
      channel: [0] => object
        {
          title:         [0] => string 
          description:   [0] => string
          language       [0] => string declare language
          lastBuildDate: [0] => date_string
          item:          [*] => array_articles
            {
              title            [0]: string
              description      [0]: description_string 
              pubDate:         [0]: date_string
            }
        }
    

  VIETNAMNET data format:
    rss:
      $ => header
      channel: [0] => object
        {
          title:         [0] => string 
          description:   [0] => string
          generator:     [0] => string: CMS version
          item:          [*] => array_articles
            {
              title            [0]: string
              description      [0]: description_string 
              pubDate:         [0]: date_string
              image:           [0]: url_string: of image
            }
        }
    

INFRASTRUCTURE:
  
  This Lambda has been scheduled by `Cloud Watch Events` to run `every Friday at 8:00P.M`

  This Lambda fetch rss feed data, parse to JSON Files

  This Lambda then PUT those JSON files into `<timestamp>`/`<file_name>`.data 


