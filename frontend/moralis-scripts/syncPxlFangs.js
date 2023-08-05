(async () => {
  await Moralis.start({
    appId: process.env.MORALIS_APP_ID,
    serverUrl: process.env.MORALIS_SERVER_URL,
  });
  async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
      await callback(array[index], index, array);
    }
  }

  const MAX = 8888;
  const LIMIT = 500;
  const Query = new Moralis.Query("PxlFangster");

  const responses = [];
  let response;

  for (let i = 0; i < MAX && response ? response?.total > i : true; i += LIMIT) {
    try {
      response = await Moralis.Web3API.token.getAllTokenIds({
        address: "0x30917a657ae7d1132bdca40187d781fa3b60002f",
        chain: "eth",
        limit: LIMIT,
        offset: i,
      });
      responses.push(response);
    } catch (e) {
      console.log("WAITING", e);
      await new Promise(r => setTimeout(r, 60_000));
      i -= LIMIT;
    }
  }
  console.log("\n");

  const pxlFangsters = responses.map(response => response.result).flat();

  await asyncForEach(pxlFangsters, async _pxlFangster => {
    try {
      const result = await Query.equalTo("tokenId", Number(_pxlFangster.token_id)).find();
      if (result.length) {
        console.log("Skipped");
        return;
      }
    } catch (e) {
      // noopt
    }

    try {
      const { data } = await Moralis.Cloud.httpRequest({ url: _pxlFangster.token_uri });
      const metadata = data;
      const metadataAttributes = metadata.attributes;

      console.log(metadata.name);

      const attributes = {
        background: metadataAttributes.find(a => a.trait_type === "Background")?.value || "",
        body: metadataAttributes.find(a => a.trait_type === "Body")?.value || "",
        collab: metadataAttributes.find(a => a.trait_type === "Collab")?.value || "",
        face: metadataAttributes.find(a => a.trait_type === "Face")?.value || "",
        fur: metadataAttributes.find(a => a.trait_type === "Fur")?.value || "",
        head: metadataAttributes.find(a => a.trait_type === "Head")?.value || "",
        image: metadata.image,
        name: metadata.name,
        secret: metadataAttributes.find(a => a.trait_type === "Secret")?.value || "",
        special: metadataAttributes.find(a => a.trait_type === "Special")?.value || "",
        team: metadataAttributes.find(a => a.trait_type === "Team")?.value || "",
        tokenId: Number(_pxlFangster.token_id),
      };

      console.log(_pxlFangster.token_id, "SAVING", attributes);
      try {
        console.log(attributes);
        // const pxlFangster = new PxlFangster();
        // await pxlFangster.save(attributes);
      } catch (e) {
        console.log("ERROR", e);
      }
      console.log(_pxlFangster.token_id, "SAVED");
    } catch (e) {
      console.log("ERROR", e);
    }
  });
})();
