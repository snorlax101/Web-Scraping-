const request = require("request-promise-core");
const cheerio = require("cheerio");
const fs = require("fs");
const json2csv = require("json2csv").Parser;


const movies = ["https://www.imdb.com/title/tt0242519/?ref_=nv_sr_srsg_3",
"https://www.imdb.com/title/tt9544034/?pf_rd_m=A2FGELUUNOQJNL&pf_rd_p=bc7330fc-dcea-4771-9ac8-70734a4f068f&pf_rd_r=NRCKY98DRSRD5RBGNH0Q&pf_rd_s=center-8&pf_rd_t=15021&pf_rd_i=tt0242519&ref_=tt_tp_i_5",
"https://www.imdb.com/title/tt6077448/?ref_=tt_sims_tti"

];


(async() => {
    let imdbData = [];

    for(let movie of movies){
        const response =await request({
      
            uri: movie,
            headers: {
                 accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
                "accept-encoding": "gzip, deflate, br",
                "accept-language": "en-US,en;q=0.9"
            },
            gzip: true
    
        });
    
        let $=cheerio.load(response)
        let title=$('div[class="title_wrapper"] > h1').text().trim()
        let rating=$('div[class="ratingValue"] > strong > span').text()
        let summary=$('div[class="summary_text ready"]').text().trim()
        let ReleaseDate=$('a[title="See more release dates"]').text().trim()
    
        imdbData.push({
            title, 
            rating,
            summary,
            ReleaseDate,
        });

    }
    

    const j2cp = new json2csv()
    const csv = j2cp.parse(imdbData)

    fs.writeFileSync("./imdb.csv", csv, "utf-8");

}

)();