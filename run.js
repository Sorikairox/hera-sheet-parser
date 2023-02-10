const { GoogleSpreadsheet } = require('google-spreadsheet');

async function sendToApi(healthCenter) {
    console.log(healthCenter);
    // return fetch(`${process.env.API_URL}/`, {
    //     method: 'POST',
    //     body: JSON.stringify(healthCenter),
    // });
}

async function getDataFromSheet(doc, title) {
    const sheet = doc.sheetsByTitle[title]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
    const rows = await sheet.getRows();
    let rowIndex = 2;
    let actualRow = rows[rowIndex];
    while (actualRow?._rawData?.length > 0 && actualRow['Sağlık Kurumu']) {
        const healthCenter = {
            name: actualRow['Sağlık Kurumu'],
            type: actualRow['Tip'],
            address: actualRow['Adres'],
            geolocation: actualRow['Geolocation'],
            lastUpdated: actualRow[`Son Kontrol Zamanı
Last Update`]
        }
        await sendToApi(healthCenter);
        rowIndex++;
        actualRow = rows[rowIndex];
    }
}

async function getSheet() {
    const sheetNames = ['Hatay-ST'];
    const doc = new GoogleSpreadsheet('1LOmr7HmL9-gAuE2ACcqGm1YTHj9j0rtlpv0DMYPZD1o');
    doc.useApiKey(process.env.SHEET_API_KEY);
    await doc.loadInfo(); // loads document properties and worksheets
    for (const name of sheetNames) {
        await getDataFromSheet(doc, name);
    }
};


getSheet();
