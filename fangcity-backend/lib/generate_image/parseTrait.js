const NE_Attributes = require('./NE_Attributes');
const order = require('./order');

function parseTrait(metaData, trait_input) {
    const TRAIT_URL = process.env.TRAIT_URL;
    layers = [];
    const trait_dict = {};
    var NE_check = false;

    console.log("computing trait dict");
    //creating dictionary for trait {"trait_type":"value"}
    //inputs traits and its values into trait_dict first
    for (var i = 0; i < trait_input.length; i++) {
        trait_dict[trait_input[i]["type"].charAt(0).toUpperCase() + trait_input[i]["type"].slice(1)] = trait_input[i]["name"];
    }

    console.log("adding rest of the traits");
    //inputs traits and its values from original metadata if it does not exists in trait_dict
    for (var i = 0; i < metaData["attributes"].length; i++) {
        if (!trait_dict.hasOwnProperty(metaData["attributes"][i]["trait_type"]) && metaData["attributes"][i]["trait_type"] !== "Upgrade") {
            trait_dict[metaData["attributes"][i]["trait_type"]] = metaData["attributes"][i]["value"];
        }
    }

    console.log(`ordering according to ${order}`);
    //ordering the trait_dict according to trait layering
    const ordered_trait = {};

    order.forEach((key) => {
        if (trait_dict.hasOwnProperty(key)) {
            ordered_trait[key] = trait_dict[key];
        }
    });

    console.log(ordered_trait);

    //check if NE
    if (NE_Attributes.includes(ordered_trait["Head"])) {
        NE_check = true;
    }

    //add _NE.png to fur and head if were _NE parts used
    for (const key in ordered_trait) {
        //Upgrade is irrelevant to the NFT's appearance, so we skip it
        if (key === "Upgrade") {
            continue;
        }
        if (NE_check && (key == "Fur" || key == "Head")) {
            layers.push(`${TRAIT_URL}${key}/${ordered_trait[key]}_NE.png`)
        } else {
            layers.push(`${TRAIT_URL}${key}/${ordered_trait[key]}.png`)
        }
    }

    //update metadata
    for (const key in ordered_trait) {
        for (var i = 0; i < metaData["attributes"].length; i++) {
            if (metaData["attributes"][i]["trait_type"] == key) {
                metaData["attributes"][i]["id"] = `${key}-${ordered_trait[key]}`;
                metaData["attributes"][i]["value"] = ordered_trait[key];
            }
        }
    }

    return layers;
}

module.exports = parseTrait;