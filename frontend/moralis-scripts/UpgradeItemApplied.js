Moralis.Cloud.afterSave("UpgradeItemApplied", async request => {
  const FANGGANG_API_TOKEN = "WjRLJlzQNfUMi8ePZMtu";
  const PXLFANGSTER_UPGRADE_URL = "https://fanggang-api.herokuapp.com/superpxl/upgrade";
  const PXLFANGSTER_CONTRACT_ADDRESS = "0x30917a657ae7d1132bdca40187d781fa3b60002f";

  const event = request.object;
  const confirmed = event?.get("confirmed");
  const collectionAddress = event?.get("applicationCollectionAddress");

  const PxlFangsterQuery = new Moralis.Query("PxlFangster");

  if (confirmed) {
    // SuperPxls upgrades
    //
    if (collectionAddress.toLowerCase() === PXLFANGSTER_CONTRACT_ADDRESS) {
      Moralis.Cloud.httpRequest({
        method: "POST",
        url: `${PXLFANGSTER_UPGRADE_URL}/${event?.get("appliedToTokenId")}?token=${FANGGANG_API_TOKEN}`,
      }).then(
        async httpResponse => {
          console.log(httpResponse.text);
          const pxlFangster = await PxlFangsterQuery.equalTo("tokenId", Number(event?.get("appliedToTokenId"))).first();
          pxlFangster.set("super", true);
          await pxlFangster.save();
        },
        httpResponse => {
          console.error("Request failed with response code " + httpResponse.status);
        }
      );
    }
  }
});
