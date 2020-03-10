const puppeteer = require("puppeteer");
const fs = require("fs");
const cheerio = require("cheerio");

const { username, password } = require('./constants');


(async () => {

    const search_word = "grace poe";
    const search_url = search_word.split(" ").join('%20');
    // https://www.facebook.com/search/posts/?q=grace%20poe&epa=FILTERS&filters=eyJycF9jcmVhdGlvbl90aW1lIjoie1wibmFtZVwiOlwiY3JlYXRpb25fdGltZVwiLFwiYXJnc1wiOlwie1xcXCJzdGFydF95ZWFyXFxcIjpcXFwiMjAyMFxcXCIsXFxcInN0YXJ0X21vbnRoXFxcIjpcXFwiMjAyMC0xXFxcIixcXFwiZW5kX3llYXJcXFwiOlxcXCIyMDIwXFxcIixcXFwiZW5kX21vbnRoXFxcIjpcXFwiMjAyMC0xMlxcXCIsXFxcInN0YXJ0X2RheVxcXCI6XFxcIjIwMjAtMS0xXFxcIixcXFwiZW5kX2RheVxcXCI6XFxcIjIwMjAtMTItMzFcXFwifVwifSJ9
    const search_link = `https://www.facebook.com/search/posts/?q=${search_url}&epa=FILTERS&filters=eyJycF9jcmVhdGlvbl90aW1lIjoie1wibmFtZVwiOlwiY3JlYXRpb25fdGltZVwiLFwiYXJnc1wiOlwie1xcXCJzdGFydF95ZWFyXFxcIjpcXFwiMjAyMFxcXCIsXFxcInN0YXJ0X21vbnRoXFxcIjpcXFwiMjAyMC0xXFxcIixcXFwiZW5kX3llYXJcXFwiOlxcXCIyMDIwXFxcIixcXFwiZW5kX21vbnRoXFxcIjpcXFwiMjAyMC0xMlxcXCIsXFxcInN0YXJ0X2RheVxcXCI6XFxcIjIwMjAtMS0xXFxcIixcXFwiZW5kX2RheVxcXCI6XFxcIjIwMjAtMTItMzFcXFwifVwifSJ9`;

    const browser = await puppeteer.launch({
        headless: false,
        args: ['--disable-notifications']
    });
    const page = await browser.newPage();
    await page.goto("https://www.facebook.com/login");

    await page.type("[id=email]", username);

    await page.type("[id=pass]", password);

    await page.click("[id=loginbutton]");

    await page.goto(search_link);

    // const scrollDown = async () => {
    //     document.querySelector('._akp')
    //         .scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
    // }


    let htmlTemp = await page.$eval(`#browse_result_area`, e => e.innerHTML);
    $ = cheerio.load(htmlTemp);


    let count = $('._6-e5').length
    while (1) {
        await page.waitFor(3000);
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
        });
        // await scrollDown(page);
        // window.scrollBy(0, document.body.scrollHeight);
        htmlTemp = await page.$eval(`#browse_result_area`, e => e.innerHTML);
        $ = cheerio.load(htmlTemp);
        let newCount = $('._6-e5').length
        console.log(newCount)
        if (newCount > count) {
            count = newCount
        }
        else {
            break
        }
    }

    // let htmlTemp = await page.$eval(`#browse_result_area`, e => e.innerHTML);
    // $ = cheerio.load(htmlTemp);

    console.log($('._6-e5').length)



    await page.waitFor(5000);
    htmlTemp = await page.$eval(`#browse_result_area`, e => e.innerHTML);
    $ = cheerio.load(htmlTemp);
    console.log($('._6-e5').length)


    $("._6-e5").each(function (i, elem) {
        const temp = cheerio.load($(this).html());
        console.log(temp("._7gyi").text())
        console.log(temp("._7gyi").attr('href'))
    });

    //*[@id="u_0_6"]
    //*[@id="u_ps_0_4_1"]/div[1]/div/div[1]/span/a

    // await page.click(`[id=u_ps_0_0_o`);

    //*[@id="u_ps_fetchstream_3_0_o"]/a[2]

    //*[@id="u_ps_0_0_o"]/a[2]

    // setTimeout(async () => {
    //     await page.type("[id=u_f_1]", search_word);
    //     await page.type("[id=u_u_2]", search_word);
    // }, 5000)
    // await page.type("[id='u_f_1']", search_word);

    //*[@id="u_f_1"]
    //*[@id="u_u_2"]/input[2]


})();


async function scrollDown(page) {
    await page.$eval('._6-e5:last-child', e => {
        e.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
    });
}