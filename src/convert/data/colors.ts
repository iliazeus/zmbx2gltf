export type MaterialType =
  | "transparent"
  | "solid"
  | "pearl"
  | "metallic"
  | "process"
  | "ink"
  | "chrome"
  | "milky"
  | "glitter"
  | "rubber";

export interface Color {
  name: string;
  type: MaterialType;
  color: number[];
}

export const colors: Readonly<Record<string, Color>> = {
  "1": {
    name: "White",
    type: "solid",
    color: [0.95686274766922, 0.95686274766922, 0.95686274766922, 1],
  },
  "2": {
    name: "Grey",
    type: "solid",
    color: [0.5411764979362488, 0.572549045085907, 0.5529412031173706, 1],
  },
  "3": {
    name: "Light Yellow",
    type: "solid",
    color: [1, 0.8392156958580017, 0.5529412031173706, 1],
  },
  "4": {
    name: "Brick Red",
    type: "solid",
    color: [0.9490196108818054, 0.43921568989753723, 0.3686274588108063, 1],
  },
  "5": {
    name: "Brick Yellow",
    type: "solid",
    color: [0.800000011920929, 0.7254902124404907, 0.5529412031173706, 1],
  },
  "6": {
    name: "Light Green",
    type: "solid",
    color: [0.6784313917160034, 0.8509804010391235, 0.658823549747467, 1],
  },
  "7": { name: "Orange", type: "solid", color: [1, 0.5215686559677124, 0, 1] },
  "8": { name: "Cobalt Blue", type: "solid", color: [0.5490196347236633, 0, 1, 1] },
  "9": {
    name: "Light Reddish Violet",
    type: "solid",
    color: [0.9647058844566345, 0.6627451181411743, 0.7333333492279053, 1],
  },
  "10": {
    name: "Clear* / Transparent*",
    type: "transparent",
    color: [1, 1, 0.7411764860153198, 0.20000000298023224],
  },
  "11": {
    name: "Pastel Blue",
    type: "solid",
    color: [0.6705882549285889, 0.8509804010391235, 1, 1],
  },
  "12": {
    name: "Light Orange Brown",
    type: "solid",
    color: [0.8470588326454163, 0.4274509847164154, 0.1725490242242813, 1],
  },
  "13": { name: "Red Orange", type: "solid", color: [1, 0.501960813999176, 0.0784313753247261, 1] },
  "14": {
    name: "Pastel Green",
    type: "solid",
    color: [0.47058823704719543, 0.9882352948188782, 0.47058823704719543, 1],
  },
  "15": { name: "Lemon", type: "solid", color: [1, 0.9490196108818054, 0.1882352977991104, 1] },
  "16": { name: "Pink", type: "solid", color: [1, 0.529411792755127, 0.6117647290229797, 1] },
  "17": { name: "Rose", type: "solid", color: [1, 0.5803921818733215, 0.5803921818733215, 1] },
  "18": {
    name: "Nougat",
    type: "solid",
    color: [0.7333333492279053, 0.501960813999176, 0.3529411852359772, 1],
  },
  "19": {
    name: "Light Brown",
    type: "solid",
    color: [0.8117647171020508, 0.5411764979362488, 0.27843138575553894, 1],
  },
  "20": {
    name: "Nature",
    type: "milky",
    color: [0.8745098114013672, 0.8745098114013672, 0.8745098114013672, 1],
  },
  "21": { name: "Bright Red", type: "solid", color: [0.7058823704719543, 0, 0, 1] },
  "22": {
    name: "Medium Reddish Violet",
    type: "solid",
    color: [0.8156862854957581, 0.3137255012989044, 0.5960784554481506, 1],
  },
  "23": {
    name: "Bright Blue",
    type: "solid",
    color: [0.11764705926179886, 0.3529411852359772, 0.658823549747467, 1],
  },
  "24": {
    name: "Bright Yellow",
    type: "solid",
    color: [0.9803921580314636, 0.7843137383460999, 0.03921568766236305, 1],
  },
  "25": {
    name: "Earth Orange",
    type: "solid",
    color: [0.3294117748737335, 0.20000000298023224, 0.1411764770746231, 1],
  },
  "26": { name: "Black", type: "solid", color: [0, 0, 0, 1] },
  "27": {
    name: "Dark Grey",
    type: "solid",
    color: [0.3294117748737335, 0.3490196168422699, 0.3333333432674408, 1],
  },
  "28": {
    name: "Dark Green",
    type: "solid",
    color: [0, 0.5215686559677124, 0.16862745583057404, 1],
  },
  "29": {
    name: "Medium Green",
    type: "solid",
    color: [0.49803921580314636, 0.7686274647712708, 0.4588235318660736, 1],
  },
  "36": {
    name: "Light Yellowish Orange",
    type: "solid",
    color: [0.9921568632125854, 0.7647058963775635, 0.5137255191802979, 1],
  },
  "37": {
    name: "Bright Green",
    type: "solid",
    color: [0.3450980484485626, 0.6705882549285889, 0.2549019753932953, 1],
  },
  "38": {
    name: "Dark Orange",
    type: "solid",
    color: [0.5686274766921997, 0.3137255012989044, 0.10980392247438431, 1],
  },
  "39": {
    name: "Light Bluish Violet",
    type: "solid",
    color: [0.686274528503418, 0.7450980544090271, 0.8392156958580017, 1],
  },
  "40": { name: "Transparent", type: "transparent", color: [0, 0, 0, 0.20000000298023224] },
  "41": {
    name: "Transparent Red",
    type: "transparent",
    color: [0.7215686440467834, 0, 0, 0.699999988079071],
  },
  "42": {
    name: "Transparent Light Blue",
    type: "transparent",
    color: [0.6784313917160034, 0.8666666746139526, 0.929411768913269, 0.699999988079071],
  },
  "43": {
    name: "Transparent Blue",
    type: "transparent",
    color: [0, 0.5215686559677124, 0.7215686440467834, 0.699999988079071],
  },
  "44": {
    name: "Transparent Yellow",
    type: "transparent",
    color: [1, 0.9019607901573181, 0.13333334028720856, 0.699999988079071],
  },
  "45": {
    name: "Light Blue",
    type: "solid",
    color: [0.5921568870544434, 0.7960784435272217, 0.8509804010391235, 1],
  },
  "47": {
    name: "Transparent Fluorescent Reddish Orange",
    type: "transparent",
    color: [0.7960784435272217, 0.30588236451148987, 0.16078431904315948, 0.699999988079071],
  },
  "48": {
    name: "Transparent Green",
    type: "transparent",
    color: [0.45098039507865906, 0.7058823704719543, 0.3921568691730499, 0.699999988079071],
  },
  "49": {
    name: "Transparent Fluorescent Green",
    type: "transparent",
    color: [0.9803921580314636, 0.9450980424880981, 0.35686275362968445, 0.699999988079071],
  },
  "50": {
    name: "Phosphorescent White",
    type: "milky",
    color: [0.8980392217636108, 0.8745098114013672, 0.8274509906768799, 1],
  },
  "100": {
    name: "Light Red",
    type: "solid",
    color: [0.9764705896377563, 0.7176470756530762, 0.6470588445663452, 1],
  },
  "101": {
    name: "Medium Red",
    type: "solid",
    color: [0.9411764740943909, 0.4274509847164154, 0.3803921639919281, 1],
  },
  "102": {
    name: "Medium Blue",
    type: "solid",
    color: [0.45098039507865906, 0.5882353186607361, 0.7843137383460999, 1],
  },
  "103": {
    name: "Light Grey",
    type: "solid",
    color: [0.7372549176216125, 0.7058823704719543, 0.6470588445663452, 1],
  },
  "104": {
    name: "Bright Violet",
    type: "solid",
    color: [0.40392157435417175, 0.12156862765550613, 0.5058823823928833, 1],
  },
  "105": {
    name: "Bright Yellowish Orange",
    type: "solid",
    color: [0.9607843160629272, 0.5254902243614197, 0.1411764770746231, 1],
  },
  "106": {
    name: "Bright Orange",
    type: "solid",
    color: [0.8392156958580017, 0.4745098054409027, 0.13725490868091583, 1],
  },
  "107": {
    name: "Bright Bluish Green",
    type: "solid",
    color: [0.0235294122248888, 0.615686297416687, 0.6235294342041016, 1],
  },
  "108": {
    name: "Earth Yellow",
    type: "solid",
    color: [0.33725491166114807, 0.27843138575553894, 0.18431372940540314, 1],
  },
  "109": {
    name: "(PC) Black IR",
    type: "transparent",
    color: [0, 0.0784313753247261, 0.0784313753247261, 0.699999988079071],
  },
  "110": {
    name: "Bright Bluish Violet",
    type: "solid",
    color: [0.14901961386203766, 0.27450981736183167, 0.6039215922355652, 1],
  },
  "111": {
    name: "Transparent Brown",
    type: "transparent",
    color: [0.7333333492279053, 0.6980392336845398, 0.6196078658103943, 0.699999988079071],
  },
  "112": {
    name: "Medium Bluish Violet",
    type: "solid",
    color: [0.2823529541492462, 0.3803921639919281, 0.6745098233222961, 1],
  },
  "113": {
    name: "Transparent Medium Reddish Violet",
    type: "transparent",
    color: [0.9921568632125854, 0.5568627715110779, 0.8117647171020508, 0.699999988079071],
  },
  "114": {
    name: "Transparent Pink Glitter / Transparent Medium Reddish Violet Glitter",
    type: "glitter",
    color: [0.9960784316062927, 0, 0.9960784316062927, 1],
  },
  "115": {
    name: "Medium Yellowish Green",
    type: "solid",
    color: [0.7176470756530762, 0.8313725590705872, 0.14509804546833038, 1],
  },
  "116": {
    name: "Medium Bluish Green",
    type: "solid",
    color: [0, 0.6666666865348816, 0.6431372761726379, 1],
  },
  "117": {
    name: "Transparent with Glitter",
    type: "glitter",
    color: [0.9686274528503418, 0.9686274528503418, 0.9686274528503418, 1],
  },
  "118": {
    name: "Light Bluish Green",
    type: "solid",
    color: [0.6117647290229797, 0.8392156958580017, 0.800000011920929, 1],
  },
  "119": {
    name: "Bright Yellowish Green",
    type: "solid",
    color: [0.6470588445663452, 0.7921568751335144, 0.0941176488995552, 1],
  },
  "120": {
    name: "Light Yellowish Green",
    type: "solid",
    color: [0.8705882430076599, 0.9176470637321472, 0.572549045085907, 1],
  },
  "121": {
    name: "Medium Yellowish Orange",
    type: "solid",
    color: [0.9725490212440491, 0.6039215922355652, 0.2235294133424759, 1],
  },
  "122": {
    name: "Nature with Glitter",
    type: "glitter",
    color: [0.9960784316062927, 0.7960784435272217, 0.5960784554481506, 1],
  },
  "123": {
    name: "Bright Reddish Orange",
    type: "solid",
    color: [0.9333333373069763, 0.3294117748737335, 0.20392157137393951, 1],
  },
  "124": {
    name: "Bright Reddish Violet",
    type: "solid",
    color: [0.5647059082984924, 0.12156862765550613, 0.4627451002597809, 1],
  },
  "125": {
    name: "Light Orange",
    type: "solid",
    color: [0.9764705896377563, 0.6549019813537598, 0.46666666865348816, 1],
  },
  "126": {
    name: "Transparent Bright Bluish Violet",
    type: "transparent",
    color: [0.43529412150382996, 0.47843137383461, 0.7215686440467834, 0.699999988079071],
  },
  "127": {
    name: "Gold",
    type: "pearl",
    color: [0.8705882430076599, 0.6745098233222961, 0.4000000059604645, 1],
  },
  "128": {
    name: "Dark Nougat",
    type: "solid",
    color: [0.6784313917160034, 0.3803921639919281, 0.250980406999588, 1],
  },
  "129": {
    name: "Transparent Bluish Violet (Glitter)",
    type: "glitter",
    color: [0.26274511218070984, 0.3294117748737335, 0.5764706134796143, 1],
  },
  "131": {
    name: "Silver",
    type: "pearl",
    color: [0.6274510025978088, 0.6274510025978088, 0.6274510025978088, 1],
  },
  "133": {
    name: "Neon Orange",
    type: "solid",
    color: [0.9372549057006836, 0.3450980484485626, 0.1568627506494522, 1],
  },
  "134": {
    name: "Neon Green",
    type: "solid",
    color: [0.8039215803146362, 0.8666666746139526, 0.20392157137393951, 1],
  },
  "135": {
    name: "Sand Blue",
    type: "solid",
    color: [0.43921568989753723, 0.5058823823928833, 0.6039215922355652, 1],
  },
  "136": {
    name: "Sand Violet",
    type: "solid",
    color: [0.4588235318660736, 0.3960784375667572, 0.4901960790157318, 1],
  },
  "137": {
    name: "Medium Orange",
    type: "solid",
    color: [0.95686274766922, 0.5058823823928833, 0.27843138575553894, 1],
  },
  "138": {
    name: "Sand Yellow",
    type: "solid",
    color: [0.5372549295425415, 0.4901960790157318, 0.3843137323856354, 1],
  },
  "139": {
    name: "Copper",
    type: "pearl",
    color: [0.4627451002597809, 0.3019607961177826, 0.23137255012989044, 1],
  },
  "140": {
    name: "Earth Blue",
    type: "solid",
    color: [0.09803921729326248, 0.19607843458652496, 0.3529411852359772, 1],
  },
  "141": {
    name: "Earth Green",
    type: "solid",
    color: [0, 0.2705882489681244, 0.10196078568696976, 1],
  },
  "143": {
    name: "Transparent Fluorescent Blue",
    type: "transparent",
    color: [0.6470588445663452, 0.8039215803146362, 0.9411764740943909, 0.699999988079071],
  },
  "145": {
    name: "Metallic Sand Blue",
    type: "pearl",
    color: [0.35686275362968445, 0.4588235318660736, 0.5647059082984924, 1],
  },
  "146": {
    name: "Metallic Sand Violet",
    type: "pearl",
    color: [0.5058823823928833, 0.4588235318660736, 0.5647059082984924, 1],
  },
  "147": {
    name: "Metallic Sand Yellow",
    type: "pearl",
    color: [0.5137255191802979, 0.4470588266849518, 0.30980393290519714, 1],
  },
  "148": {
    name: "Metallic Dark Grey",
    type: "pearl",
    color: [0.2823529541492462, 0.3019607961177826, 0.2823529541492462, 1],
  },
  "149": {
    name: "Metallic Black",
    type: "pearl",
    color: [0.03921568766236305, 0.07450980693101883, 0.15294118225574493, 1],
  },
  "150": {
    name: "Metallic Light Grey",
    type: "pearl",
    color: [0.5960784554481506, 0.6078431606292725, 0.6000000238418579, 1],
  },
  "151": {
    name: "Sand Green",
    type: "solid",
    color: [0.43921568989753723, 0.5568627715110779, 0.48627451062202454, 1],
  },
  "153": {
    name: "Sand Red",
    type: "solid",
    color: [0.5333333611488342, 0.3764705955982208, 0.3686274588108063, 1],
  },
  "154": {
    name: "(New) Dark Red",
    type: "solid",
    color: [0.4470588266849518, 0, 0.07058823853731155, 1],
  },
  "157": {
    name: "Transparent Fluorescent Yellow",
    type: "transparent",
    color: [1, 0.9647058844566345, 0.3607843220233917, 0.699999988079071],
  },
  "158": {
    name: "Transparent Fluorescent Red",
    type: "transparent",
    color: [0.9450980424880981, 0.5568627715110779, 0.7333333492279053, 0.699999988079071],
  },
  "168": {
    name: "Gun Metallic",
    type: "pearl",
    color: [0.3764705955982208, 0.33725491166114807, 0.2980392277240753, 1],
  },
  "176": {
    name: "Red Flip/Flop",
    type: "pearl",
    color: [0.5803921818733215, 0.3176470696926117, 0.2823529541492462, 1],
  },
  "178": {
    name: "Yellow Flip/Flop",
    type: "pearl",
    color: [0.6705882549285889, 0.40392157435417175, 0.22745098173618317, 1],
  },
  "179": {
    name: "Silver Flip/Flop",
    type: "pearl",
    color: [0.45098039507865906, 0.4470588266849518, 0.4431372582912445, 1],
  },
  "180": {
    name: "Curry",
    type: "solid",
    color: [0.8666666746139526, 0.5960784554481506, 0.18039216101169586, 1],
  },
  "182": {
    name: "Transparent Bright Orange",
    type: "transparent",
    color: [0.8823529481887817, 0.5529412031173706, 0.03921568766236305, 0.699999988079071],
  },
  "183": {
    name: "Metallic White",
    type: "pearl",
    color: [0.9647058844566345, 0.9490196108818054, 0.8745098114013672, 1],
  },
  "184": {
    name: "Metallic Bright Red",
    type: "pearl",
    color: [0.8392156958580017, 0, 0.14901961386203766, 1],
  },
  "185": {
    name: "Metallic Bright Blue",
    type: "pearl",
    color: [0, 0.3490196168422699, 0.6392157077789307, 1],
  },
  "186": {
    name: "Metallic Dark Green",
    type: "pearl",
    color: [0, 0.5568627715110779, 0.23529411852359772, 1],
  },
  "187": {
    name: "Metallic Earth Orange",
    type: "pearl",
    color: [0.34117648005485535, 0.2235294133424759, 0.1725490242242813, 1],
  },
  "188": {
    name: "Tiny Blue",
    type: "solid",
    color: [0, 0.6196078658103943, 0.8078431487083435, 1],
  },
  "189": {
    name: "Reddish Gold / Gold Metallic",
    type: "pearl",
    color: [0.6745098233222961, 0.5098039507865906, 0.27843138575553894, 1],
  },
  "190": {
    name: "Fire Yellow",
    type: "solid",
    color: [1, 0.8117647171020508, 0.04313725605607033, 1],
  },
  "191": {
    name: "Flame Yellowish Orange",
    type: "solid",
    color: [0.9882352948188782, 0.6745098233222961, 0, 1],
  },
  "192": {
    name: "Reddish Brown",
    type: "solid",
    color: [0.37254902720451355, 0.1921568661928177, 0.03529411926865578, 1],
  },
  "193": {
    name: "Flame Reddish Orange",
    type: "solid",
    color: [0.9254902005195618, 0.2666666805744171, 0.11372549086809158, 1],
  },
  "194": {
    name: "Medium Stone Grey",
    type: "solid",
    color: [0.5882353186607361, 0.5882353186607361, 0.5882353186607361, 1],
  },
  "195": {
    name: "Royal Blue",
    type: "solid",
    color: [0.10980392247438431, 0.3450980484485626, 0.6549019813537598, 1],
  },
  "196": {
    name: "Dark Royal Blue",
    type: "solid",
    color: [0.054901961237192154, 0.24313725531101227, 0.6039215922355652, 1],
  },
  "197": {
    name: "Bright Lilac",
    type: "solid",
    color: [0.1921568661928177, 0.16862745583057404, 0.529411792755127, 1],
  },
  "198": {
    name: "Bright Reddish Lilac",
    type: "solid",
    color: [0.5411764979362488, 0.07058823853731155, 0.658823549747467, 1],
  },
  "199": {
    name: "Dark Stone Grey",
    type: "solid",
    color: [0.3921568691730499, 0.3921568691730499, 0.3921568691730499, 1],
  },
  "200": {
    name: "Lemon Metallic",
    type: "pearl",
    color: [0.4156862795352936, 0.4745098054409027, 0.2666666805744171, 1],
  },
  "208": {
    name: "Light Stone Grey",
    type: "solid",
    color: [0.7843137383460999, 0.7843137383460999, 0.7843137383460999, 1],
  },
  "209": {
    name: "Dark Curry",
    type: "solid",
    color: [0.6431372761726379, 0.4627451002597809, 0.1411764770746231, 1],
  },
  "210": {
    name: "Faded Green",
    type: "solid",
    color: [0.27450981736183167, 0.5411764979362488, 0.37254902720451355, 1],
  },
  "211": {
    name: "Turquoise",
    type: "solid",
    color: [0.24705882370471954, 0.7137255072593689, 0.6627451181411743, 1],
  },
  "212": {
    name: "Light Royal Blue",
    type: "solid",
    color: [0.615686297416687, 0.7647058963775635, 0.9686274528503418, 1],
  },
  "213": {
    name: "Medium Royal Blue",
    type: "solid",
    color: [0.27843138575553894, 0.43529412150382996, 0.7137255072593689, 1],
  },
  "216": {
    name: "Rust",
    type: "solid",
    color: [0.529411792755127, 0.16862745583057404, 0.09019608050584793, 1],
  },
  "217": {
    name: "Brown",
    type: "solid",
    color: [0.48235294222831726, 0.364705890417099, 0.2549019753932953, 1],
  },
  "218": {
    name: "Reddish Lilac",
    type: "solid",
    color: [0.5568627715110779, 0.3333333432674408, 0.5921568870544434, 1],
  },
  "219": {
    name: "Lilac",
    type: "solid",
    color: [0.33725491166114807, 0.30588236451148987, 0.615686297416687, 1],
  },
  "220": {
    name: "Light Lilac",
    type: "solid",
    color: [0.5686274766921997, 0.5843137502670288, 0.7921568751335144, 1],
  },
  "221": {
    name: "Bright Purple",
    type: "solid",
    color: [0.7843137383460999, 0.3137255012989044, 0.6078431606292725, 1],
  },
  "222": {
    name: "Light Purple",
    type: "solid",
    color: [1, 0.6196078658103943, 0.8039215803146362, 1],
  },
  "223": {
    name: "Light Pink",
    type: "solid",
    color: [0.9450980424880981, 0.47058823704719543, 0.501960813999176, 1],
  },
  "224": {
    name: "Light Brick Yellow",
    type: "solid",
    color: [0.9529411792755127, 0.7882353067398071, 0.5333333611488342, 1],
  },
  "225": {
    name: "Warm Yellowish Orange",
    type: "solid",
    color: [0.9803921580314636, 0.6627451181411743, 0.3921568691730499, 1],
  },
  "226": {
    name: "Cool Yellow",
    type: "solid",
    color: [1, 0.9254902005195618, 0.42352941632270813, 1],
  },
  "227": {
    name: "Transparent Bright Yellowish Green",
    type: "transparent",
    color: [0.7882353067398071, 0.9058823585510254, 0.5333333611488342, 0.699999988079071],
  },
  "228": {
    name: "Transparent Medium Bluish Green",
    type: "transparent",
    color: [0.3333333432674408, 0.6470588445663452, 0.686274528503418, 0.699999988079071],
  },
  "229": {
    name: "Transparent Light Bluish Green",
    type: "transparent",
    color: [0.6745098233222961, 0.8313725590705872, 0.8705882430076599, 0.699999988079071],
  },
  "230": {
    name: "Transparent Bright Purple",
    type: "transparent",
    color: [0.9254902005195618, 0.6392157077789307, 0.7882353067398071, 0.699999988079071],
  },
  "231": {
    name: "Transparent Flame Yellowish Orange",
    type: "transparent",
    color: [0.9882352948188782, 0.7176470756530762, 0.4274509847164154, 0.699999988079071],
  },
  "232": {
    name: "Dove Blue",
    type: "solid",
    color: [0.46666666865348816, 0.7882353067398071, 0.8470588326454163, 1],
  },
  "233": {
    name: "Light Faded Green",
    type: "solid",
    color: [0.3764705955982208, 0.729411780834198, 0.4627451002597809, 1],
  },
  "234": {
    name: "Transparent Fire Yellow",
    type: "transparent",
    color: [0.9843137264251709, 0.9098039269447327, 0.5647059082984924, 0.699999988079071],
  },
  "236": {
    name: "Transparent Bright Reddish Lilac",
    type: "transparent",
    color: [0.5529412031173706, 0.45098039507865906, 0.7019608020782471, 0.699999988079071],
  },
  "268": {
    name: "Medium Lilac",
    type: "solid",
    color: [0.2666666805744171, 0.10196078568696976, 0.5686274766921997, 1],
  },
  "269": {
    name: "Tiny-Medium Blue",
    type: "solid",
    color: [0.24313725531101227, 0.5843137502670288, 0.7137255072593689, 1],
  },
  "283": {
    name: "Light Nougat",
    type: "solid",
    color: [1, 0.7882353067398071, 0.5843137502670288, 1],
  },
  "284": {
    name: "Transparent Reddish Lilac",
    type: "transparent",
    color: [0.8784313797950745, 0.8156862854957581, 0.8980392217636108, 0.699999988079071],
  },
  "285": {
    name: "Transparent Light Green",
    type: "transparent",
    color: [0.8941176533699036, 0.8392156958580017, 0.8549019694328308, 0.699999988079071],
  },
  "294": {
    name: "Phosphorescent Green",
    type: "milky",
    color: [0.8352941274642944, 0.8627451062202454, 0.5411764979362488, 1],
  },
  "295": {
    name: "Flamingo Pink",
    type: "solid",
    color: [0.21568627655506134, 0.12941177189350128, 0, 1],
  },
  "296": {
    name: "Cool Silver",
    type: "pearl",
    color: [0.6784313917160034, 0.6784313917160034, 0.6784313917160034, 1],
  },
  "297": {
    name: "Warm Gold",
    type: "pearl",
    color: [0.7254902124404907, 0.5843137502670288, 0.23137255012989044, 1],
  },
  "298": {
    name: "Cool Silver, Drum Lacquered",
    type: "metallic",
    color: [0.4627451002597809, 0.4627451002597809, 0.4627451002597809, 1],
  },
  "308": {
    name: "Dark Brown",
    type: "solid",
    color: [0.2078431397676468, 0.12941177189350128, 0, 1],
  },
  "309": {
    name: "Metalized Silver",
    type: "chrome",
    color: [0.8078431487083435, 0.8078431487083435, 0.8078431487083435, 1],
  },
  "310": {
    name: "Metalized Gold",
    type: "chrome",
    color: [0.8745098114013672, 0.7568627595901489, 0.4627451002597809, 1],
  },
  "311": {
    name: "Transparent Bright Green",
    type: "transparent",
    color: [0.686274528503418, 0.8235294222831726, 0.27450981736183167, 0.699999988079071],
  },
  "312": {
    name: "Medium Nougat",
    type: "solid",
    color: [0.6666666865348816, 0.4901960790157318, 0.3333333432674408, 1],
  },
  "315": {
    name: "Silver Metallic",
    type: "pearl",
    color: [0.5490196347236633, 0.5490196347236633, 0.5490196347236633, 1],
  },
  "316": {
    name: "Titanium Metallic",
    type: "pearl",
    color: [0.24313725531101227, 0.23529411852359772, 0.2235294133424759, 1],
  },
  "321": {
    name: "Dark Azur",
    type: "solid",
    color: [0.27450981736183167, 0.6078431606292725, 0.7647058963775635, 1],
  },
  "322": {
    name: "Medium Azur",
    type: "solid",
    color: [0.40784314274787903, 0.7647058963775635, 0.886274516582489, 1],
  },
  "323": {
    name: "Aqua",
    type: "solid",
    color: [0.8274509906768799, 0.9490196108818054, 0.9176470637321472, 1],
  },
  "324": {
    name: "Medium Lavender",
    type: "solid",
    color: [0.6274510025978088, 0.4313725531101227, 0.7254902124404907, 1],
  },
  "325": {
    name: "Lavender",
    type: "solid",
    color: [0.8039215803146362, 0.6431372761726379, 0.8705882430076599, 1],
  },
  "326": {
    name: "Spring Yellowish Green",
    type: "solid",
    color: [0.886274516582489, 0.9764705896377563, 0.6039215922355652, 1],
  },
  "329": {
    name: "White Glow",
    type: "milky",
    color: [0.9607843160629272, 0.9529411792755127, 0.843137264251709, 1],
  },
  "330": {
    name: "Olive Green",
    type: "solid",
    color: [0.545098066329956, 0.5176470875740051, 0.30980393290519714, 1],
  },
  "331": {
    name: "Lacquer",
    type: "ink",
    color: [0.9333333373069763, 0.9333333373069763, 0.9333333373069763, 1],
  },
  "332": {
    name: "Fluorescent Red Ink",
    type: "ink",
    color: [0.8156862854957581, 0.4274509847164154, 0.30980393290519714, 1],
  },
  "333": {
    name: "Fluorescent Green Ink",
    type: "ink",
    color: [0.8588235378265381, 0.9176470637321472, 0.47843137383461, 1],
  },
  "334": {
    name: "Copper Ink",
    type: "ink",
    color: [0.4627451002597809, 0.3019607961177826, 0.23137255012989044, 1],
  },
  "335": {
    name: "Gold Ink",
    type: "ink",
    color: [0.7254902124404907, 0.5843137502670288, 0.23137255012989044, 1],
  },
  "336": {
    name: "Silver Ink",
    type: "ink",
    color: [0.5490196347236633, 0.5490196347236633, 0.5490196347236633, 1],
  },
  "337": {
    name: "Titanium",
    type: "ink",
    color: [0.24313725531101227, 0.23529411852359772, 0.2235294133424759, 1],
  },
  "353": {
    name: "Vibrant Coral",
    type: "solid",
    color: [1, 0.4274509847164154, 0.46666666865348816, 1],
  },
  "429": {
    name: "Yellow",
    type: "process",
    color: [0.9490196108818054, 0.8705882430076599, 0.16470588743686676, 1],
  },
  "439": {
    name: "Magenta",
    type: "process",
    color: [0.7607843279838562, 0, 0.5176470875740051, 1],
  },
  "454": {
    name: "Cyan",
    type: "process",
    color: [0.21568627655506134, 0.5921568870544434, 0.8039215803146362, 1],
  },
  "1026": {
    name: "(?) Black Rubber",
    type: "rubber",
    color: [0.0000901960811461322, 0.0000901960811461322, 0.0000901960811461322, 1],
  },
};
