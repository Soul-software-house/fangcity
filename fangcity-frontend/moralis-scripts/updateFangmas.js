Moralis.Cloud.define(
  "updateFangmas",
  async request => {
    try {
      const user = request?.user;
      const number = Number(request?.params?.number);

      const nfts = await Moralis.Web3API.account.getNFTsForContract({
        chain: "eth",
        address: user?.get("ethAddress"),
        token_address: "0x9d418c2cae665d877f909a725402ebd3a0742844",
      });

      const tokenIds = nfts?.result?.length
        ? nfts.result
            .filter(t => t?.token_address === "0x9d418c2cae665d877f909a725402ebd3a0742844")
            .map(t => (t?.token_id ? Number(t.token_id) : null))
            .filter(t => t)
        : [];

      if (tokenIds?.length && !user?.get("fangmas") && !user?.get("fangmasOpenedAt") && number) {
        user.set("fangmas", number);
        user.set("fangmasOpenedAt", new Date());
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
