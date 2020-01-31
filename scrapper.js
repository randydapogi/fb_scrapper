const puppeteer = require("puppeteer");
const fs = require("fs");
const cheerio = require("cheerio");

const excelbuilder = require("msexcel-builder");

(async () => {
  const username = "username";
  const password = "password";

  const post_id = "770990920045959";
  const filename = "fb_scrape.xls";

  const post_link = `https://m.facebook.com/${post_id}`;

  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  await page.goto("https://www.facebook.com/login");

  await page.type("[id=email]", username);

  await page.type("[id=pass]", password);

  await page.click("[id=loginbutton]");

  await page.goto(post_link);

  //*[@id="see_prev_2636504486387423"]

  var htmlContent = await page.$eval(`#ufi_${post_id}`, e => e.innerHTML);
  var htmlTemp;

  var $ = cheerio.load(htmlContent);
  var currentLength = $("._2a_i").length;

  var ctr = 0;
  while (1) {
    console.log("Next", currentLength);
    try {
      await page.waitForSelector(`[id=see_next_${post_id}]`, {
        timeout: 3000
      });
      await page.click(`[id=see_next_${post_id}]`);
      await page.waitFor(3000);
    } catch (error) {
      // console.log("The element didn't appear.")
      // break
      try {
        await page.waitForSelector(`[id=see_prev_${post_id}]`, {
          timeout: 3000
        });
        await page.click(`[id=see_prev_${post_id}]`);
        await page.waitFor(3000);
      } catch (error) {
        // console.log("The element didn't appear.")
        break;
      }
    }

    htmlTemp = await page.$eval(`#ufi_${post_id}`, e => e.innerHTML);

    $ = cheerio.load(htmlTemp);

    if (currentLength < $("._2a_i").length) {
      // htmlContent = htmlTemp;
      currentLength = $("._2a_i").length;
      ctr += 1;
      if (ctr > 50) {
        break;
      }
    } else {
      break;
    }
  }

  var rows = [];

  $("._2a_i").each(function(i, elem) {
    const temp = cheerio.load($(this).html());

    const commentor = temp("._2b05").text();
    const comment = temp("[data-sigil=comment-body]")
      .text()
      .replace("\t", " ")
      .replace("\n", " ");
    // console.log(i, commentor, '::', comment)
    temp_row = [];
    temp_row.push(i, commentor, comment);
    rows.push(temp_row);
  });

  var data = "ID\tCommentor\tComment\n";

  rows.forEach(row => {
    data = data + row[0] + "\t" + row[1] + "\t" + row[2] + "\n";
  });

  fs.writeFile(filename, data, err => {
    if (err) throw err;
    console.log("File created");
  });

  await browser.close();
})();
