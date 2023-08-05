Moralis.Cloud.define(
  "updateFangiversary",
  async request => {
    const validFrom = new Date("2022-08-26T00:00:00Z");
    const validTo = new Date("2022-09-04T00:00:00Z");
    const now = new Date();

    if (now < validFrom || now > validTo) {
      return "Fangiversary is closed!";
    }

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

      if (tokenIds?.length && number) {
        user.set("fangiversary", number);
        user.set("fangiversarySelectedAt", new Date());
        await user.save(null, { useMasterKey: true });
        return true;
      } else {
        return "No Fang Gang NFT was found in wallet!";
      }
    } catch (e) {
      return e.toString();
    }
  },
  {
    fields: ["number"],
    requireUser: true,
  }
);
