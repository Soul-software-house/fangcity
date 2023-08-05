interface IFangster {
  token_address: string; // "0x9d418c2cae665d877f909a725402ebd3a0742844";
  token_id: string; // "8415";
  contract_type: string; // "ERC721";
  token_uri: string; // "https://fanggang.s3.us-east-2.amazonaws.com/metadata/8415";
  metadata: null;
  synced_at: null;
  amount: string; // "1";
  name: string; // "Fang Gang";
  symbol: string; // "FNG";
}

interface IFangsterMetadata {
  name: string; // "Fangster 8526";
  description: string; // "Fang Gang is a collection of 8888 randomly assembled Fangsters - twisted lunatics that come out at night to throw parties, hang around in dark alleys and have fun on the streets of New Fang City.";
  image: string; // "https://fanggang.s3.us-east-2.amazonaws.com/img/8526.png";
  attributes: IFangsterAttribute[];
}

interface IFangsterAttribute {
  trait_type: string; // "Background";
  value: string; // "Magenta"
}

export { IFangster, IFangsterAttribute, IFangsterMetadata };
