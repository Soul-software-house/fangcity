Moralis.Cloud.define(
  "ogClaimShirt",
  async request => {
    const OG_HOLDER_ITEM_ID = 2;
    const AWOO_ITEMS_CONTRACT_ADDRESS = "0x5506faC5d5965cab6CADB6f6FbcF6B62E495B3a3";

    const user = request?.user;
    const walletAddress = user?.get("ethAddress").toString();

    const validTo = new Date("2022-08-31T00:00:00Z");
    const now = new Date();

    if (now > validTo) {
      return null;
    }

    try {
      const nfts = await Moralis.Web3API.account.getNFTsForContract({
        chain: "eth",
        address: user?.get("ethAddress"),
        token_address: AWOO_ITEMS_CONTRACT_ADDRESS,
      });

      const ogItems = [];
      nfts?.result?.forEach(r => {
        for (let x = 0; x < Number(r?.amount); x++) {
          if (Number(r.token_id) === OG_HOLDER_ITEM_ID) {
            const metadata = JSON.parse(r.metadata);
            ogItems.push(metadata);
          }
        }
      });

      if (ogItems.length === 0) {
        return null;
      }

      const ShirtClaim = new Moralis.Query("ShirtClaim");
      const claims = await ShirtClaim.equalTo("walletAddress", walletAddress).find();

      if (claims?.length > 0) {
        return claims[0];
      } else {
        let claims = null;
        claims = await ShirtClaim.equalTo("walletAddress", "").find();
        if (claims?.length === 0) {
          claims = await ShirtClaim.equalTo("walletAddress", null).find();
        }

        if (claims?.length > 0) {
          const claim = claims[0];
          claim.set("walletAddress", walletAddress);
          await claim.save();

          return claim;
        } else {
          return null;
        }
      }
    } catch (_) {
      return null;
    }
  },
  {
    fields: [],
    requireUser: true,
  }
);
