import puppeteer from "puppeteer";
import { inspectionHTML } from "./templates/inspectionTemplate";

export async function generateInspectionPDF(data) {
  const browser = await puppeteer.launch({ args:["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(inspectionHTML(data));
  const pdf = await page.pdf({ format:"A4", printBackground:true });
  await browser.close();
  return pdf;
}
