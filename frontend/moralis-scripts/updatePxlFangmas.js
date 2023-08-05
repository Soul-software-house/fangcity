Moralis.Cloud.define(
  "updatePxlFangmas",
  async request => {
    try {
      const user = request?.user;
      const number = Number(request?.params?.number);

      const nfts = await Moralis.Web3API.account.getNFTsForContract({
        chain: "eth",
        address: user?.get("ethAddress"),
        token_address: "0x30917a657ae7d1132bdca40187d781fa3b60002f",
      });

      const tokenIds = nfts?.result?.length
        ? nfts.result
            .filter(t => t?.token_address === "0x30917a657ae7d1132bdca40187d781fa3b60002f")
            .map(t => (t?.token_id ? Number(t.token_id) : null))
            .filter(t => t)
        : [];

      if (tokenIds?.length && !user?.get("pxlFangmas") && !user?.get("pxlFangmasOpenedAt") && number) {
        user.set("pxlFangmas", number);
        user.set("pxlFangmasOpenedAt", new Date());
        await user.save(null, { useMasterKey: true });
        return true;
      } else {
        return false;
      }
    } catch (e) {
      return false;
    }
  },
  {
    fields: ["number"],
    requireUser: true,
  }
);
