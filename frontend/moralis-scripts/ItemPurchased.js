Moralis.Cloud.afterSave("ItemPurchased", async request => {
  const SHIRT_ITEM_ID = 6;

  const event = request.object;
  const confirmed = event?.get("confirmed");
  const walletAddress = event?.get("purchasedBy").toString();
  const itemId = event?.get("itemId");

  if (confirmed && Number(itemId) === SHIRT_ITEM_ID) {
    const ShirtClaim = new Moralis.Query("ShirtClaim");
    const claims = await ShirtClaim.equalTo("walletAddress", walletAddress).find();

    if (claims?.length === 0) {
      const claims = await ShirtClaim.equalTo("walletAddress", "").find();

      if (claims?.length > 0) {
        const claim = claims[0];
        claim.set("walletAddress", walletAddress);
        await claim.save();

        return claim;
      }
    }
  }

  return null;
});
