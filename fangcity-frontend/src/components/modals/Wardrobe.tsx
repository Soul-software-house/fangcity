import React, { useEffect, useState } from "react";
import { useMoralis } from "react-moralis";
import { Combobox } from "@headlessui/react";
import mergeImages from "merge-images";
import Moralis from "moralis-v1";

import { useGlobalState } from "../../App";
import { Button } from "../Button";
import { Modal } from "../Modal";
import { DisclosureText } from "../DisclosureText";

import secret from "../../assets/images/wardrobe/Secret.gif";
import silhouette from "../../assets/images/silhouette.png";

// The Outsider Collective Traits
import outsider1 from "../../assets/images/wardrobe/Outsider 1.png";
import outsider2 from "../../assets/images/wardrobe/Outsider 2.png";
import outsider3 from "../../assets/images/wardrobe/Outsider 3.png";
import outsider4 from "../../assets/images/wardrobe/Outsider 4.png";

// Community Traits
// import community1 from "../../assets/images/wardrobe/Community 1.png";
// import community2 from "../../assets/images/wardrobe/Community 2.png";
// import community3 from "../../assets/images/wardrobe/Community 3.png";
// import community4 from "../../assets/images/wardrobe/Community 4.png";

// The Plague Traits
// import thePlague1 from "../../assets/images/wardrobe/The Plague 1.png";
// import thePlague2 from "../../assets/images/wardrobe/The Plague 2.png";
// import thePlague3 from "../../assets/images/wardrobe/The Plague 3.png";
// import thePlague4 from "../../assets/images/wardrobe/The Plague 4.png";

// Lucky Ducky Traits
// import luckyDucky1 from "../../assets/images/wardrobe/Lucky Ducky 1.png";
// import luckyDucky2 from "../../assets/images/wardrobe/Lucky Ducky 2.png";
// import luckyDucky3 from "../../assets/images/wardrobe/Lucky Ducky 3.png";
// import luckyDucky4 from "../../assets/images/wardrobe/Lucky Ducky 4.png";

// Mortiverse Traits
// import mortiverse1 from "../../assets/images/wardrobe/Mortiverse 1.png";
// import mortiverse2 from "../../assets/images/wardrobe/Mortiverse 2.png";
// import mortiverse3 from "../../assets/images/wardrobe/Mortiverse 3.png";
// import mortiverse4 from "../../assets/images/wardrobe/Mortiverse 4.png";

// SSD Traits
// import ssd1 from "../../assets/images/wardrobe/SSD 1.png";
// import ssd2 from "../../assets/images/wardrobe/SSD 2.png";
// import ssd3 from "../../assets/images/wardrobe/SSD 3.png";
// import ssd4 from "../../assets/images/wardrobe/SSD 4.png";

// Valentines Traits
// import valentines1 from "../../assets/images/wardrobe/Valentines 1.png";
// import valentines2 from "../../assets/images/wardrobe/Valentines 2.png";
// import valentines3 from "../../assets/images/wardrobe/Valentines 3.png";
// import valentines4 from "../../assets/images/wardrobe/Valentines 4.png";
// import valentines5 from "../../assets/images/wardrobe/Valentines 5.png";
// import valentines6 from "../../assets/images/wardrobe/Valentines 6.png";
// import valentines7 from "../../assets/images/wardrobe/Valentines 7.png";
// import valentines8 from "../../assets/images/wardrobe/Valentines 8.png";

// Ape Gang Traits
// import apeGang1 from "../../assets/images/wardrobe/Ape Gang 1.png";
// import apeGang2 from "../../assets/images/wardrobe/Ape Gang 2.png";
// import apeGang3 from "../../assets/images/wardrobe/Ape Gang 3.png";
// import apeGang4 from "../../assets/images/wardrobe/Ape Gang 4.png";

// Cosmodinos Traits
// import cosmodinos1 from "../../assets/images/wardrobe/Cosmodinos 1.png";
// import cosmodinos2 from "../../assets/images/wardrobe/Cosmodinos 2.png";
// import cosmodinos3 from "../../assets/images/wardrobe/Cosmodinos 3.png";
// import cosmodinos4 from "../../assets/images/wardrobe/Cosmodinos 4.png";

// Wonderpals Traits
// import wonderpals1 from "../../assets/images/wardrobe/Wonderpals 1.png";
// import wonderpals2 from "../../assets/images/wardrobe/Wonderpals 2.png";
// import wonderpals3 from "../../assets/images/wardrobe/Wonderpals 3.png";
// import wonderpals4 from "../../assets/images/wardrobe/Wonderpals 4.png";

// Monster Suit Traits
// import monsterSuit1 from "../../assets/images/wardrobe/Monster Suit 1.png";
// import monsterSuit2 from "../../assets/images/wardrobe/Monster Suit 2.png";
// import monsterSuit3 from "../../assets/images/wardrobe/Monster Suit 3.png";
// import monsterSuit4 from "../../assets/images/wardrobe/Monster Suit 4.png";

// GM Traits
import gmBowlAncient from "../../assets/images/wardrobe/GM_Bowl_Ancient.png";
import gmBowlFire from "../../assets/images/wardrobe/GM_Bowl_Fire.png";
import gmBowlHaze from "../../assets/images/wardrobe/GM_Bowl_Haze.png";
import gmBowlMystic from "../../assets/images/wardrobe/GM_Bowl_Mystic.png";
import gmBowlRainbow from "../../assets/images/wardrobe/GM_Bowl_Rainbow.png";
import gmBowlTrippy from "../../assets/images/wardrobe/GM_Bowl_Trippy.png";
import gmCupAncient from "../../assets/images/wardrobe/GM_Cup_Ancient.png";
import gmCupFire from "../../assets/images/wardrobe/GM_Cup_Fire.png";
import gmCupHaze from "../../assets/images/wardrobe/GM_Cup_Haze.png";
import gmCupMystic from "../../assets/images/wardrobe/GM_Cup_Mystic.png";
import gmCupRainbow from "../../assets/images/wardrobe/GM_Cup_Rainbow.png";
import gmCupTrippy from "../../assets/images/wardrobe/GM_Cup_Trippy.png";

// Friday the 13th Traits
// import gmCupBloody from "../../assets/images/wardrobe/GM_Cup_Bloody.png";
// import macheteR from "../../assets/images/wardrobe/MacheteR.png";
// import uniform from "../../assets/images/wardrobe/Uniform.png";

// Fangiversary
// import balloons from "../../assets/images/wardrobe/1 Balloons.png";
// import blueStreamers from "../../assets/images/wardrobe/2 Streamers Blue.png";
// import pinkStreamers from "../../assets/images/wardrobe/3 Streamers Pink.png";
// import greenStreamers from "../../assets/images/wardrobe/4 Streamers Green.png";
// import confetti from "../../assets/images/wardrobe/5 Confetti.png";
// import leftPopper from "../../assets/images/wardrobe/6 Popper Left.png";
// import rightPopper from "../../assets/images/wardrobe/7 Popper Right.png";
// import pinkPiggyTaco from "../../assets/images/wardrobe/8 Pink Piggy Taco.png";
// import cupcake from "../../assets/images/wardrobe/9 Cupcake.png";
// import birthdayCake from "../../assets/images/wardrobe/10 Birthday Cake.png";
// import multicolorPartyHat from "../../assets/images/wardrobe/11 Party Hat Multicolor.png";
// import greenPartyHat from "../../assets/images/wardrobe/12 Party Hat Green.png";
// import pinkPartyHat from "../../assets/images/wardrobe/13 Party Hat Pink.png";
// import bluePartyHat from "../../assets/images/wardrobe/14 Party Hat Blue.png";
// import awooGoggles from "../../assets/images/wardrobe/15 Awoo Goggles.png";
// import starGlasses from "../../assets/images/wardrobe/16 Star Glasses.png";
// import balloonShades from "../../assets/images/wardrobe/16.1 Balloon Shades.png";
// import thunderShades from "../../assets/images/wardrobe/16.2 Thunder Shades.png";
// import beer from "../../assets/images/wardrobe/17 Beer.png";
// import champagneGlass from "../../assets/images/wardrobe/18 Champagne Glass.png";
// import champagneBottle from "../../assets/images/wardrobe/19 Champagne Bottle.png";
// import trippyGift from "../../assets/images/wardrobe/20 Trippy Gift.png";
// import rainbowGift from "../../assets/images/wardrobe/21 Rainbow Gift.png";
// import hazeGift from "../../assets/images/wardrobe/22 Haze Gift.png";
// import fireGift from "../../assets/images/wardrobe/23 Fire Gift.png";
// import ancientGift from "../../assets/images/wardrobe/24 Ancient Gift.png";
// import mysticGift from "../../assets/images/wardrobe/25 Mystic Gift.png";
// import oneYearOldBadge from "../../assets/images/wardrobe/26 One Year Old Badge.png";
// import oneChain from "../../assets/images/wardrobe/26.1 1 Chain.png";
// import flowerNecklace from "../../assets/images/wardrobe/26.2 Flower Necklace.png";
// import fg4lTattoo from "../../assets/images/wardrobe/27 FG4L Tattoo.png";
// import scribbleBalloon from "../../assets/images/wardrobe/28 Balloon Scribble.png";
// import fangBalloon from "../../assets/images/wardrobe/29 Balloon Fang.png";
// import balloonsShirt from "../../assets/images/wardrobe/29.1 Balloons.png";
// import partyCostume from "../../assets/images/wardrobe/29.2 Party Costume.png";
// import fireworksTanktop from "../../assets/images/wardrobe/29.3 Fireworks Tanktop.png";
// import rainbowTanktop from "../../assets/images/wardrobe/29.4 Rainbow Tanktop.png";
// import wrapperTear from "../../assets/images/wardrobe/30 Wrapper Tear.png";
// import wrappedUp from "../../assets/images/wardrobe/31 Wrapped Up.png";

// Fangmas 2022
// import beanieBlue from "../../assets/images/wardrobe/Fangmas_Beanie Blue.png";
// import beanieFangmas from "../../assets/images/wardrobe/Fangmas_Beanie Fangmas.png";
// import beanieIce from "../../assets/images/wardrobe/Fangmas_Beanie Ice.png";
// import carrotNose from "../../assets/images/wardrobe/Fangmas_Carrot Nose.png";
// import elfHat from "../../assets/images/wardrobe/Fangmas_Elf Hat.png";
// import fangmasGrillz from "../../assets/images/wardrobe/Fangmas_Fangmas Grillz.png";
// import hoodieBlue from "../../assets/images/wardrobe/Fangmas_Hoodie Blue.png";
// import hoodieFangmas from "../../assets/images/wardrobe/Fangmas_Hoodie Fangmas.png";
// import hoodieIce from "../../assets/images/wardrobe/Fangmas_Hoodie Ice.png";
// import hoodieSnow from "../../assets/images/wardrobe/Fangmas_Hoodie Snow.png";
// import lightbulbTshirt from "../../assets/images/wardrobe/Fangmas_Lightbulb Tshirt.png";
// import lightbulbs from "../../assets/images/wardrobe/Fangmas_Lightbulbs.png";
// import redNose from "../../assets/images/wardrobe/Fangmas_Red Nose.png";
// import santaBeanie from "../../assets/images/wardrobe/Fangmas_Santa Beanie.png";
// import santaBeard from "../../assets/images/wardrobe/Fangmas_Santa Beard.png";
// import santaBody from "../../assets/images/wardrobe/Fangmas_Santa Body.png";
// import santaHat from "../../assets/images/wardrobe/Fangmas_Santa Hat.png";
// import scarfBlue from "../../assets/images/wardrobe/Fangmas_Scarf Blue.png";
// import scarfFangmas from "../../assets/images/wardrobe/Fangmas_Scarf Fangmas.png";
// import scarfIce from "../../assets/images/wardrobe/Fangmas_Scarf Ice.png";
// import snowGoggles from "../../assets/images/wardrobe/Fangmas_Snow Goggles.png";
// import snowfall from "../../assets/images/wardrobe/Fangmas_Snowfall.png";
// import snowFangBody from "../../assets/images/wardrobe/Fangmas_SnowFang Body.png";
// import snowFangHead from "../../assets/images/wardrobe/Fangmas_SnowFang Head.png";
// import snowglobeHead from "../../assets/images/wardrobe/Fangmas_Snowglobe Head.png";
// import sweaterBlue from "../../assets/images/wardrobe/Fangmas_Sweater Blue.png";
// import sweaterFangmas from "../../assets/images/wardrobe/Fangmas_Sweater Fangmas.png";
// import sweaterIce from "../../assets/images/wardrobe/Fangmas_Sweater Ice.png";
// import sweaterWLDFNGZ from "../../assets/images/wardrobe/Fangmas_Sweater WLDFNGZ.png";

// Howl-o-ween 2022 - Part II
// import bloodPaw from "../../assets/images/wardrobe/Blood Paw.png";
// import candyMystic from "../../assets/images/wardrobe/Candy Mystic.png";
// import candyAncient from "../../assets/images/wardrobe/Candy Ancient.png";
// import candyFire from "../../assets/images/wardrobe/Candy Fire.png";
// import candyHaze from "../../assets/images/wardrobe/Candy Haze.png";
// import candyRainbow from "../../assets/images/wardrobe/Candy Rainbow.png";
// import candyTrippy from "../../assets/images/wardrobe/Candy Trippy.png";
// import dagger from "../../assets/images/wardrobe/Dagger.png";
// import deadFounder from "../../assets/images/wardrobe/Dead Founder.png";
// import downHoodie from "../../assets/images/wardrobe/Down Hoodie.png";
// import formaldehyde from "../../assets/images/wardrobe/Formaldehyde.png";
// import frankHead from "../../assets/images/wardrobe/Frank Head.png";
// import frankNails from "../../assets/images/wardrobe/Frank Nails.png";
// import hellraiser from "../../assets/images/wardrobe/Hellraiser.png";

// Howl-o-ween 2022
// import candles from "../../assets/images/wardrobe/Candles.png";
// import clownCostume from "../../assets/images/wardrobe/Clown_Costume.png";
// import dahmerGlasses from "../../assets/images/wardrobe/Dahmer_Glasses.png";
// import fangulaCape from "../../assets/images/wardrobe/Fangula_Cape.png";
// import fangulaEars from "../../assets/images/wardrobe/Fangula_Ears.png";
// import ghost from "../../assets/images/wardrobe/Ghost.png";
// import machete from "../../assets/images/wardrobe/Machete.png";
// import mask from "../../assets/images/wardrobe/Mask.png";
// import mummy from "../../assets/images/wardrobe/Mummy.png";
// import prisonUniform from "../../assets/images/wardrobe/Prison_Uniform.png";
// import witchHat from "../../assets/images/wardrobe/Witch_Hat.png";
// import boo from "../../assets/images/wardrobe/Boo.png";

// Howl-o-ween
// import bat from "../../assets/images/wardrobe/Bat_Decoration.png";
// import bloodyHoodie from "../../assets/images/wardrobe/Bloody_Hoodie.png";
// import bloodyTshirt from "../../assets/images/wardrobe/Bloody_Tshirt.png";
// import broom from "../../assets/images/wardrobe/Broom.png";
// import candyCorn from "../../assets/images/wardrobe/Candycorn_Decoration.png";
// import candyCornHoodie from "../../assets/images/wardrobe/Candycorn_Hoodie.png";
// import candyCornTshirt from "../../assets/images/wardrobe/Candycorn_Tshirt.png";
// import clownFace from "../../assets/images/wardrobe/Clown_Face.png";
// import ghostfaceMask from "../../assets/images/wardrobe/Ghostface_Mask.png";
// import ghosts from "../../assets/images/wardrobe/Ghosts_Decoration.png";
// import evilPumpkinHead from "../../assets/images/wardrobe/Pumpkin_Head_Evil.png";
// import pumpkinHead from "../../assets/images/wardrobe/Pumpkin_Head_Neutral.png";
// import pumpkinShirt from "../../assets/images/wardrobe/Pumpkin_Shirt.png";
// import scratchedHoodie from "../../assets/images/wardrobe/Scratched_Hoodie.png";
// import scythe from "../../assets/images/wardrobe/Scythe.png";
// import skeletonShirt from "../../assets/images/wardrobe/Skeleton_Shirt.png";
// import skeletonTshirt from "../../assets/images/wardrobe/Skeleton_Tshirt.png";
// import skullMask from "../../assets/images/wardrobe/Skull_Mask.png";
// import slimeHoodie from "../../assets/images/wardrobe/Slime_Hoodie.png";
// import spiderOutfit from "../../assets/images/wardrobe/Spider_Outfit.png";
// import spiders from "../../assets/images/wardrobe/Spiders_Decoration.png";
// import witchNose from "../../assets/images/wardrobe/Witch_Nose.png";

import Collab4 from "../../assets/images/wardrobe/Collab4.png";
import Collab5 from "../../assets/images/wardrobe/Collab5.png";
import Collab6 from "../../assets/images/wardrobe/Collab6.png";
import Collab7 from "../../assets/images/wardrobe/Collab7.png";
import Collab8 from "../../assets/images/wardrobe/Collab8.png";
import Collab9 from "../../assets/images/wardrobe/Collab9.png";
import Collab10 from "../../assets/images/wardrobe/Collab10.png";
import Collab11 from "../../assets/images/wardrobe/Collab11.png";
import Collab12 from "../../assets/images/wardrobe/Collab12.png";
import Collab13 from "../../assets/images/wardrobe/Collab13.png";

interface IItem {
  name: string;
  value: string;
  image: string;
}

// prettier-ignore
const COLLABS = {
  "4": Collab4,
  "5": Collab5,
  "6": Collab6,
  "7": Collab7,
  "8": Collab8,
  "9": Collab9,
  "10": Collab10,
  "11": Collab11,
  "12": Collab12,
  "13": Collab13,
};

// the order of this array controls the order of the traits in the wardrobe
const ITEMS: IItem[] = [
  // The Outsider Collective Traits
  { name: "Outsider 1", value: "outsider-1", image: outsider1 },
  { name: "Outsider 2", value: "outsider-2", image: outsider2 },
  { name: "Outsider 3", value: "outsider-3", image: outsider3 },
  { name: "Outsider 4", value: "outsider-4", image: outsider4 },
  
  // Community Traits
  // { name: "Community 1", value: "community-1", image: community1 },
  // { name: "Community 2", value: "community-2", image: community2 },
  // { name: "Community 3", value: "community-3", image: community3 },
  // { name: "Community 4", value: "community-4", image: community4 },
  
  // The Plague Traits
  // { name: "The Plague 1", value: "the-plague-1", image: thePlague1 },
  // { name: "The Plague 2", value: "the-plague-2", image: thePlague2 },
  // { name: "The Plague 3", value: "the-plague-3", image: thePlague3 },
  // { name: "The Plague 4", value: "the-plague-4", image: thePlague4 },
  
  // Lucky Ducky Traits
  // { name: "Lucky Ducky 1", value: "lucky-ducky-1", image: luckyDucky1 },
  // { name: "Lucky Ducky 2", value: "lucky-ducky-2", image: luckyDucky2 },
  // { name: "Lucky Ducky 3", value: "lucky-ducky-3", image: luckyDucky3 },
  // { name: "Lucky Ducky 4", value: "lucky-ducky-4", image: luckyDucky4 },
  
  // Mortiverse Traits
  // { name: "Mortiverse 1", value: "mortiverse-1", image: mortiverse1 },
  // { name: "Mortiverse 2", value: "mortiverse-2", image: mortiverse2 },
  // { name: "Mortiverse 3", value: "mortiverse-3", image: mortiverse3 },
  // { name: "Mortiverse 4", value: "mortiverse-4", image: mortiverse4 },
  
  // SSD Traits
  // { name: "SSD 1", value: "ssd-1", image: ssd1 },
  // { name: "SSD 2", value: "ssd-2", image: ssd2 },
  // { name: "SSD 3", value: "ssd-3", image: ssd3 },
  // { name: "SSD 4", value: "ssd-4", image: ssd4 },
  
  // Valentines Traits
  // { name: "Valentines 1", value: "valentines-1", image: valentines1 },
  // { name: "Valentines 2", value: "valentines-2", image: valentines2 },
  // { name: "Valentines 3", value: "valentines-3", image: valentines3 },
  // { name: "Valentines 4", value: "valentines-4", image: valentines4 },
  // { name: "Valentines 5", value: "valentines-5", image: valentines5 },
  // { name: "Valentines 6", value: "valentines-6", image: valentines6 },
  // { name: "Valentines 7", value: "valentines-7", image: valentines7 },
  // { name: "Valentines 8", value: "valentines-8", image: valentines8 },
  
  // Ape Gang Traits
  // { name: "Ape Gang 1", value: "ape-gang-1", image: apeGang1 },
  // { name: "Ape Gang 2", value: "ape-gang-2", image: apeGang2 },
  // { name: "Ape Gang 3", value: "ape-gang-3", image: apeGang3 },
  // { name: "Ape Gang 4", value: "ape-gang-4", image: apeGang4 },
  
  // Cosmodinos Traits
  // { name: "Cosmodinos 1", value: "cosmodinos-1", image: cosmodinos1 },
  // { name: "Cosmodinos 2", value: "cosmodinos-2", image: cosmodinos2 },
  // { name: "Cosmodinos 3", value: "cosmodinos-3", image: cosmodinos3 },
  // { name: "Cosmodinos 4", value: "cosmodinos-4", image: cosmodinos4 },
  
  // Wonderpals Traits
  // { name: "Wonderpals 1", value: "wonderpals-1", image: wonderpals1 },
  // { name: "Wonderpals 2", value: "wonderpals-2", image: wonderpals2 },
  // { name: "Wonderpals 3", value: "wonderpals-3", image: wonderpals3 },
  // { name: "Wonderpals 4", value: "wonderpals-4", image: wonderpals4 },
  
  // Monster Suit Traits
  // { name: "Monster Suit 1", value: "monster-suit-1", image: monsterSuit1 },
  // { name: "Monster Suit 2", value: "monster-suit-2", image: monsterSuit2 },
  // { name: "Monster Suit 3", value: "monster-suit-3", image: monsterSuit3 },
  // { name: "Monster Suit 4", value: "monster-suit-4", image: monsterSuit4 },
  
  // GM Traits
  { name: "GM Cup Ancient", value: "gm-cup-ancient", image: gmCupAncient },
  { name: "GM Cup Fire", value: "gm-cup-fire", image: gmCupFire },
  { name: "GM Cup Haze", value: "gm-cup-haze", image: gmCupHaze },
  { name: "GM Cup Mystic", value: "gm-cup-mystic", image: gmCupMystic },
  { name: "GM Cup Rainbow", value: "gm-cup-rainbow", image: gmCupRainbow },
  { name: "GM Cup Trippy", value: "gm-cup-trippy", image: gmCupTrippy },
  { name: "GM Bowl Ancient", value: "gm-bowl-ancient", image: gmBowlAncient },
  { name: "GM Bowl Fire", value: "gm-bowl-fire", image: gmBowlFire },
  { name: "GM Bowl Haze", value: "gm-bowl-haze", image: gmBowlHaze },
  { name: "GM Bowl Mystic", value: "gm-bowl-mystic", image: gmBowlMystic },
  { name: "GM Bowl Rainbow", value: "gm-bowl-rainbow", image: gmBowlRainbow },
  { name: "GM Bowl Trippy", value: "gm-bowl-trippy", image: gmBowlTrippy },
  
  // Friday the 13th Traits
  // { name: "GM Cup Bloody", value: "gm-cup-bloody", image: gmCupBloody },
  // { name: "MacheteR", value: "machete-R", image: macheteR },
  // { name: "Uniform", value: "uniform", image: uniform },
  
  // fangiversary
  // { name: "Baloons", value: "balloons", image: balloons },
  // { name: "Blue Streamers", value: "blue-streamers", image: blueStreamers },
  // { name: "Pink Streamers", value: "pink-streamers", image: pinkStreamers },
  // { name: "Green Streamers", value: "green-streamers", image: greenStreamers },
  // { name: "Confetti", value: "confetti", image: confetti },
  // { name: "Left Popper", value: "left-popper", image: leftPopper },
  // { name: "Right Popper", value: "right-popper", image: rightPopper },
  // { name: "Pink Piggy Taco", value: "pink-piggy-taco", image: pinkPiggyTaco },
  // { name: "Cupcake", value: "cupcake", image: cupcake },
  // { name: "Birthday Cake", value: "birthday-cake", image: birthdayCake },
  // { name: "Multicolor Party Hat", value: "multicolor-party-hat", image: multicolorPartyHat },
  // { name: "Green Party Hat", value: "green-party-hat", image: greenPartyHat },
  // { name: "Pink Party Hat", value: "pink-party-hat", image: pinkPartyHat },
  // { name: "Blue Party Hat", value: "blue-party-hat", image: bluePartyHat },
  // { name: "Awoo Goggles", value: "awoo-goggles", image: awooGoggles },
  // { name: "Star Glasses", value: "star-glasses", image: starGlasses },
  // { name: "Balloon Shades", value: "balloon-shades", image: balloonShades },
  // { name: "Thunder Shades", value: "thunder-shades", image: thunderShades },
  // { name: "Beer", value: "beer", image: beer },
  // { name: "Champagne Glass", value: "champagne-glass", image: champagneGlass },
  // { name: "Champagne Bottle", value: "champagne-bottle", image: champagneBottle },
  // { name: "Trippy Gift", value: "trippy-gift", image: trippyGift },
  // { name: "Rainbow Gift", value: "rainbow-gift", image: rainbowGift },
  // { name: "Haze Gift", value: "haze-gift", image: hazeGift },
  // { name: "Fire Gift", value: "fire-gift", image: fireGift },
  // { name: "Ancient Gift", value: "ancient-gift", image: ancientGift },
  // { name: "Mystic Gift", value: "mystic-gift", image: mysticGift },
  // { name: "One Year Old Badge", value: "one-year-old-badge", image: oneYearOldBadge },
  // { name: "1 Chain", value: "1-chain", image: oneChain },
  // { name: "Flower Necklace", value: "flower-necklace", image: flowerNecklace },
  // { name: "FG4L Tattoo", value: "fg4l-tattoo", image: fg4lTattoo },
  // { name: "Scribble Balloon", value: "scribble-balloon", image: scribbleBalloon },
  // { name: "Fang Balloon", value: "fang-balloon", image: fangBalloon },
  // { name: "Balloons", value: "balloons-shirt", image: balloonsShirt },
  // { name: "Party Costume", value: "party-costume", image: partyCostume },
  // { name: "Fireworks Tanktop", value: "fireworks-tanktop", image: fireworksTanktop },
  // { name: "Rainbow Tanktop", value: "rainbow-tanktop", image: rainbowTanktop },
  // { name: "Wrapper Tear", value: "wrapper-tear", image: wrapperTear },
  // { name: "Wrapped Up", value: "wrapped-up", image: wrappedUp },

  // howl-o-ween 2 - part ii
  // { name: "Blood Paw", value: "blood-paw", image: bloodPaw },
  // { name: "Candy Mystic", value: "candy-mystic", image: candyMystic },
  // { name: "Candy Ancient", value: "candy-ancient", image: candyAncient },
  // { name: "Candy Fire", value: "candy-fire", image: candyFire },
  // { name: "Candy Haze", value: "candy-haze", image: candyHaze },
  // { name: "Candy Rainbow", value: "candy-rainbow", image: candyRainbow },
  // { name: "Candy Trippy", value: "candy-trippy", image: candyTrippy },
  // { name: "Dagger", value: "dagger", image: dagger },
  // { name: "Dead Founder", value: "dead-founder", image: deadFounder },
  // { name: "Down Hoodie", value: "down-hoodie", image: downHoodie },
  // { name: "Formaldehyde", value: "formaldehyde", image: formaldehyde },
  // { name: "Frank Head", value: "frank-head", image: frankHead },
  // { name: "Frank Nails", value: "frank-nails", image: frankNails },
  // { name: "Hellraiser", value: "hellraiser", image: hellraiser },

  // fangmas 2022
  // { name: "Beanie Blue", value: "beanie-blue", image: beanieBlue },
  // { name: "Beanie Fangmas", value: "beanie-fangmas", image: beanieFangmas },
  // { name: "Beanie Ice", value: "beanie-ice", image: beanieIce },
  // { name: "Carrot Nose", value: "carrot-nose", image: carrotNose },
  // { name: "Elf Hat", value: "elf-hat", image: elfHat },
  // { name: "Fangmas Grillz", value: "fangmas-grillz", image: fangmasGrillz },
  // { name: "Hoodie Blue", value: "hoodie-blue", image: hoodieBlue },
  // { name: "Hoodie Fangmas", value: "hoodie-fangmas", image: hoodieFangmas },
  // { name: "Hoodie Ice", value: "hoodie-ice", image: hoodieIce },
  // { name: "Hoodie Snow", value: "hoodie-snow", image: hoodieSnow },
  // { name: "Lightbulb Tshirt", value: "lightbulb-tshirt", image: lightbulbTshirt },
  // { name: "Lightbulbs", value: "lightbulbs", image: lightbulbs },
  // { name: "Red Nose", value: "red-nose", image: redNose },
  // { name: "Santa Beanie", value: "santa-beanie", image: santaBeanie },
  // { name: "Santa Beard", value: "santa-beard", image: santaBeard },
  // { name: "Santa Body", value: "santa-body", image: santaBody },
  // { name: "Santa Hat", value: "santa-hat", image: santaHat },
  // { name: "Scarf Blue", value: "scarf-blue", image: scarfBlue },
  // { name: "Scarf Fangmas", value: "scarf-fangmas", image: scarfFangmas },
  // { name: "Scarf Ice", value: "scarf-ice", image: scarfIce },
  // { name: "Snow Goggles", value: "snow-goggles", image: snowGoggles },
  // { name: "Snowfall", value: "snowfall", image: snowfall },
  // { name: "Snow Fang Body", value: "snow-fang-body", image: snowFangBody },
  // { name: "Snow Fang Head", value: "snow-fang-head", image: snowFangHead },
  // { name: "Snowglobe Head", value: "snowglobe-head", image: snowglobeHead },
  // { name: "Sweater Blue", value: "sweater-blue", image: sweaterBlue },
  // { name: "Sweater Fangmas", value: "sweater-fangmas", image: sweaterFangmas },
  // { name: "Sweater Ice", value: "sweater-ice", image: sweaterIce },
  // { name: "Sweater WLDFNGZ", value: "sweater-wldfngz", image: sweaterWLDFNGZ },
  
  // howl-o-ween 2
  // { name: "Candles", value: "candles", image: candles },
  // { name: "Clown Costume", value: "clown-costume", image: clownCostume },
  // { name: "Dahmer Glasses", value: "dahmer-glasses", image: dahmerGlasses },
  // { name: "Fangula Cape", value: "fangula-cape", image: fangulaCape },
  // { name: "Fangula Ears", value: "fangula-ears", image: fangulaEars },
  // { name: "Ghost", value: "ghost", image: ghost },
  // { name: "Machete", value: "machete", image: machete },
  // { name: "Mask", value: "mask", image: mask },
  // { name: "Mummy", value: "mummy", image: mummy },
  // { name: "Prison Uniform", value: "prison-uniform", image: prisonUniform },
  // { name: "Witch Hat", value: "witch-hat", image: witchHat },
  // { name: "Boo", value: "boo", image: boo },

  // howl-o-ween
  // { name: "Bat", value: "bat", image: bat },
  // { name: "Bloody Hoodie", value: "bloody-hoodie", image: bloodyHoodie },
  // { name: "Bloody T-Shirt", value: "bloody-tshirt", image: bloodyTshirt },
  // { name: "Broom", value: "broom", image: broom },
  // { name: "Candy Corn", value: "candy-corn", image: candyCorn },
  // { name: "Candy Corn Hoodie", value: "candy-corn-hoodie", image: candyCornHoodie },
  // { name: "Candy Corn T-Shirt", value: "candy-corn-tshirt", image: candyCornTshirt },
  // { name: "Clown Face", value: "clown-face", image: clownFace },
  // { name: "Ghostface Mask", value: "ghostface-mask", image: ghostfaceMask },
  // { name: "Ghosts", value: "ghosts", image: ghosts },
  // { name: "Evil Pumpkin Head", value: "evil-pumpkin-head", image: evilPumpkinHead },
  // { name: "Pumpkin Head", value: "pumpkin-head", image: pumpkinHead },
  // { name: "Pumpkin Shirt", value: "pumpkin-shirt", image: pumpkinShirt },
  // { name: "Scratched Hoodie", value: "scratched-hoodie", image: scratchedHoodie },
  // { name: "Scythe", value: "scythe", image: scythe },
  // { name: "Skeleton Shirt", value: "skeleton-shirt", image: skeletonShirt },
  // { name: "Skeleton T-Shirt", value: "skeleton-tshirt", image: skeletonTshirt },
  // { name: "Skull Mask", value: "skull-mask", image: skullMask },
  // { name: "Slime Hoodie", value: "slime-hoodie", image: slimeHoodie },
  // { name: "Spider Outfit", value: "spider-outfit", image: spiderOutfit },
  // { name: "Spiders", value: "spiders", image: spiders },
  // { name: "Witch Nose", value: "witch-nose", image: witchNose },
];

const getBase64FromUrl = async url => {
  const data = await fetch(`https://fanggang-api.herokuapp.com/fanggang/${url.substring(url.lastIndexOf("/") + 1)}`, {
    headers: { Origin: "http://localhost:3000" },
  });
  const blob = await data.blob();
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      resolve(base64data);
    };
  });
};

const Fangsters = new Moralis.Query("Fangster");

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const Wardrobe = () => {
  const { user, isAuthenticated, isWeb3Enabled, enableWeb3 } = useMoralis();
  const [modal] = useGlobalState("modal");
  const [fangsterId, setFangsterId] = useState(user?.get("currentFangster"));
  const [fangsterImageSrc, setFangsterImageSrc] = useState(secret);
  const [imageSrc, setImageSrc] = useState(secret);
  const [selectedItems, setSelectedItems] = useState([]);

  const processImage = async (inputId: string): Promise<void> => {
    const id = inputId.length ? inputId : user?.get("currentFangster");
    const invalid = id === "";

    if (invalid) {
      setSelectedItems([]);
      setImageSrc(secret);
      setFangsterImageSrc(secret);
    } else if (COLLABS[id]) {
      setFangsterImageSrc(COLLABS[id]);
      updateImage(COLLABS[id]);
    } else {
      Fangsters.equalTo("tokenId", Number(id));

      const fangsters = await Fangsters.find();
      const image = fangsters[0]?.attributes?.image || secret;

      try {
        await getBase64FromUrl(image).then((data: string) => {
          setFangsterImageSrc(data);
          updateImage(data);
        });
      } catch (e) {
        setFangsterImageSrc(secret);
        updateImage(secret);
      }
    }
  };

  useEffect(() => {
    if (modal === "wardrobe") {
      if (!isWeb3Enabled) {
        enableWeb3();
      } else if (isAuthenticated) {
        processImage("");
      }
    }
  }, [modal, isAuthenticated, isWeb3Enabled, enableWeb3]); // eslint-disable-line react-hooks/exhaustive-deps

  const updateImage = image => {
    mergeImages([image].concat(selectedItems.map(item => item.image)).filter(i => i)).then(b64 => setImageSrc(b64));
  };

  useEffect(() => {
    if (modal !== "wardrobe") {
      setImageSrc(secret);
      setSelectedItems([]);
      setFangsterId("");
    } else {
      setFangsterId(user?.get("currentFangster"));
    }
  }, [modal]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => updateImage(fangsterImageSrc), [selectedItems, fangsterImageSrc]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Modal title="Wardrobe" modal="wardrobe">
      <div className="mx-auto max-w-[min(50vh,400px)] overflow-hidden">
        <div
          className="max-h-[min(50vh,400px)] overflow-hidden border-purple-light bg-purple-light"
          style={{
            borderRadius: "min(7vh, 35%)",
            borderWidth: "0.5vh",
          }}
        >
          <img
            className="h-full w-full select-none border-purple-light bg-purple-light"
            src={imageSrc}
            alt="Fangster"
          />
        </div>
        <Button
          color="green"
          disabled={!fangsterId}
          onClick={() => {
            const link = document.createElement("a");
            link.href = imageSrc;
            link.setAttribute("download", `${fangsterId}.png`);

            // Append to html link element page
            document.body.appendChild(link);

            // Start download
            link.click();

            // Clean up and remove the link
            link.parentNode.removeChild(link);
          }}
          text="Download"
        />
      </div>

      <p className="mt-8 ml-2 block text-left text-lg text-white">Fangster ID</p>
      <div className="relative mt-1">
        <input
          id="tokenId"
          name="tokenId"
          type="number"
          accept="numbers"
          autoComplete="off"
          value={fangsterId}
          onChange={e => {
            setFangsterId(e?.target?.value?.length ? e.target.value : "");
            processImage(e.target.value);
          }}
          className="focus:ring-border-purple-dark block w-full appearance-none rounded-xl border-[0.5vh] border-purple-dark bg-purple-light px-4 pb-2 pt-4 text-center font-mono text-lg text-white placeholder-slate-300 focus:border-purple-dark focus:outline-none md:text-2xl"
        />
      </div>

      <div className="mt-8">
        <p className="mt-8 ml-2 block text-left text-lg text-white">Wardrobe Items</p>
        <DisclosureText className="mx-2 mb-4 text-left">
          Select any number of items below to dress up your Fangster! The order you select the items controls how they
          are layered so have fun and get creative!
        </DisclosureText>
        <Combobox value={selectedItems} onChange={setSelectedItems} multiple>
          <Combobox.Options static>
            <div className="mt-2 grid grid-cols-3 gap-3 text-left sm:grid-cols-4 sm:gap-4">
              {ITEMS.map(item => (
                <Combobox.Option key={item.value} value={item}>
                  {({ selected }) => (
                    <div
                      className={classNames(
                        selected ? "ring-2 ring-red-light" : "",
                        "relative flex cursor-pointer overflow-hidden rounded-xl border-[0.5vh] border-purple-dark bg-purple-light p-0 focus:outline-none"
                      )}
                    >
                      <div className="flex w-full justify-between">
                        <div className="flex flex-col">
                          <span className="relative flex items-center justify-center text-sm text-white">
                            {selected ? (
                              <div className="pointer-events-none absolute z-10 rounded-lg bg-purple-dark bg-opacity-50 py-2 px-4 text-center text-lg">
                                {selectedItems.indexOf(item) + 1}
                              </div>
                            ) : null}
                            <img className="opacity-75" src={silhouette} alt="silhoette" />
                            <img className="absolute" src={item.image} alt={item.name} />
                          </span>
                        </div>
                        <div
                          className={classNames(
                            selected ? "border-red-dark" : "border-transparent",
                            "pointer-events-none absolute -inset-px"
                          )}
                          aria-hidden="true"
                        />
                      </div>
                    </div>
                  )}
                </Combobox.Option>
              ))}
            </div>
          </Combobox.Options>
        </Combobox>
      </div>
    </Modal>
  );
};
