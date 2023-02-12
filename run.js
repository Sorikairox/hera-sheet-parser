require("dotenv").config();
const fs = require("fs");
const { GoogleSpreadsheet } = require("google-spreadsheet");

async function sendToApi(healthCenter) {
    fetch(`${process.env.API_URL}/`, {
        method: "POST",
        body: JSON.stringify(healthCenter),
    })
        .then((response) => response.json())
        .then((data) => console.log({ data }))
        .catch((e) => {
            console.error(e);
        });
}

async function getDataFromSheet(doc, id) {
    const sheet = doc.sheetsById[id];
    const rows = await sheet.getRows();
    let rowIndex = 0;
    let actualRow = rows[rowIndex];
    while (
        actualRow?._rawData?.length > 0 &&
        actualRow["Sağlık Kurumu"] &&
        actualRow["Geolocation"]
    ) {
        const healthCenter = {
            name: actualRow["Sağlık Kurumu"],
            type: actualRow["Tip"],
            address: actualRow["Adres"],
            geolocation: actualRow["Geolocation"],
            activity_state: actualRow["Aktiflik Durumu"],
            last_updated: actualRow[`Son Kontrol Zamanı
        Last Update`]
        };
        await sendToApi(healthCenter);
        rowIndex++;
        actualRow = rows[rowIndex];
    }
}

async function getSheet() {
    const sheetIds = [
        "1949824942",
        "1082353851",
        "746053151",
        "27526041",
        "2041877251",
        "2048152375",
        "73091904",
        "259646093",
        "915052335",
        "390529091",
        "957586673",
    ];
    const doc = new GoogleSpreadsheet(
        "1LOmr7HmL9-gAuE2ACcqGm1YTHj9j0rtlpv0DMYPZD1o"
    );
    doc.useApiKey(process.env.SHEET_API_KEY);
    await doc.loadInfo(); // loads document properties and worksheets

    for (const id of sheetIds) {
        await getDataFromSheet(doc, id);
    }
}

getSheet();
