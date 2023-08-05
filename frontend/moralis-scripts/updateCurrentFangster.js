Moralis.Cloud.define(
  "updateCurrentFangster",
  async request => {
    const User = Moralis.Object.extend("User");
    const tokenId = request.params.tokenId;

    const nfts = await Moralis.Web3API.account.getNFTsForContract({
      chain: "eth",
      address: request?.user?.get("ethAddress"),
      token_address: "0x9d418c2cae665d877f909a725402ebd3a0742844",
    });

    const tokenIds = nfts?.result?.length
      ? nfts.result.map(t => (t?.token_id ? Number(t.token_id) : null)).filter(t => t || t === 0)
      : [];

    if (tokenIds.includes(Number(tokenId))) {
      const user = new User();
      user.set("objectId", request.user.objectId);
      user.set("id", request.user.id);
      user.set("currentFangster", tokenId);
      await user.save(null, { useMasterKey: true });
      return true;
    } else {
      return false;
    }
  },
  {
    fields: ["tokenId"],
    requireUser: true,
  }
);
