import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {

  //open weather.com 
  await page.goto('https://weather.com');

  //Handle the potential consent form
  const consentFrame = await page.$('iframe[title="SP Consent Message"]');
  if (consentFrame) {
    const frame = await consentFrame.contentFrame();
    await frame?.click('text="Reject all"');
    await page.waitForURL('**')
    await page.waitForLoadState('load')
  } 

});

test.afterEach(async ({ page, context }) => {
  await page.close();
  await context.close();
});

test('1. Lund Evening < 17', async ({ page }) => {

  // Fill in 'Lund' into the search box
  await page.getByTestId('searchModalInputBox').fill('Lund');

  // Select Lund from the dropdown
  await page.getByRole('option', { name: 'Lund, Skåne, Sweden' }).waitFor({ state: 'visible', timeout: 5000 })
  await page.getByRole('option', { name: 'Lund, Skåne, Sweden' }).click();

  // Wait for page load
  await page.waitForURL('**')
  await page.waitForLoadState('load')

  // Click on the degree and language settings
  await page.getByTestId('languageSelectorSection').getByTestId('ctaButton').waitFor({ state: 'visible', timeout: 5000 })
  await page.getByTestId('languageSelectorSection').getByTestId('ctaButton').click();

  // Click on celsius
  await page.getByTestId('degreesCbutton').waitFor({ state: 'visible', timeout: 5000 })
  await page.getByTestId('degreesCbutton').click();

  // Find and asses degrees for Lund evening
  const locator = page.getByTestId("WeatherTable").getByTestId('SegmentHighTemp').getByTestId('TemperatureValue').nth(2);
  const textContent = await locator.textContent();

  if (textContent !== null){
    const degrees = Number(textContent.match(/\d+/)![0]);
    expect(degrees).toBeLessThan(17);
  }

});

test('2. Amsterdam Humidity <= 80%', async ({ page }) => {

  //Skip navigation to correct page because of time limit
  await page.goto('https://weather.com/weather/today/l/968d2f1a5509a2f71fca25929b7d83139ac5134f61611a9c6637c90354cd6da8');

  // Find and asses humidity for Amsterdam
  const locator = page.getByTestId('PercentageValue');
  const textContent = await locator.textContent();

  if (textContent !== null){
    const humidity = Number(textContent.match(/\d+/)![0]);
    expect(humidity).toBeLessThan(80);
  }

});

test('3. Lund Rain next hour', async ({ page }) => {
  
  //Skip navigation to correct page because of time limit
  await page.goto('https://weather.com/weather/hourbyhour/l/6f605c570ceefbbfca300b7b97efe1891d8b83508b364ba5bbd65d53df279533?unit=m');

  // Find and asses rain in Lund in the coming hour
  const locator = page.locator('#detailIndex0').getByTestId('AccumulationValue');
  const textContent = await locator.textContent();

  if (textContent !== null){
    const rainAmount = Number(textContent.match(/\d+/)![0]);
    expect(rainAmount).toBe(0);
  }

});

