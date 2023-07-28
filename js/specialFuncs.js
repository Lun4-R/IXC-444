// Legacy version of starFormat
function starFormatLegacy(value, threshold, starsPerLine, multiplier, multiplierType, maxStarsDisplayed, palette) {
  let modifiedThreshold = threshold;

  if (multiplierType === "Additive") {
    modifiedThreshold += multiplier;
  } else if (multiplierType === "Multiplicative") {
    modifiedThreshold *= multiplier;
  } else if (multiplierType === "Exponential") {
    modifiedThreshold = Math.pow(multiplier, Math.floor(value / threshold));
  }

  const totalStars = Math.floor(value / modifiedThreshold); 

  const defaultColor = 'white'; 
  const starCharacters = {
    normal: '★', 
    condensed: '★', 
  };

  if (palette) {

    starCharacters.normal = palette.normal || starCharacters.normal;
    starCharacters.condensed = palette.condensed || starCharacters.condensed;
  }

  if (totalStars <= maxStarsDisplayed) {
    const lines = Math.ceil(totalStars / starsPerLine);
    return Array.from({ length: lines }, (_, lineIndex) => {
      const starsInLine = Math.min(totalStars - lineIndex * starsPerLine, starsPerLine);
      return `<span style="color:${defaultColor}">${starCharacters.normal.repeat(starsInLine)}</span>`;
    }).join('\n');
  } else {
    return `<span style="color:${defaultColor}">${starCharacters.condensed}</span> [${totalStars}]`;
  }
}




function starFormat(value, threshold, starsPerLine, maxStarsDisplayed) {
 const totalStars = new Decimal(value).div(threshold).floor(); // Calculate the total number of stars to display

 if (totalStars.lte(maxStarsDisplayed)) {
  const lines = new Decimal(totalStars).div(starsPerLine).ceil();

  return Array.from({ length: lines.toNumber() }, (_, lineIndex) => {
   const starsInLine = (totalStars.sub(lineIndex).mul(starsPerLine), starsPerLine);
   return '★'.repeat(starsInLine);
  }).join('\n');
 } else {
  return `★ [${format(totalStars)}]`;
 }
}
