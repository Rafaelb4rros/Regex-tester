const form = document.getElementById("formrgx");
const targetInput = document.getElementById("target");
const regexInput = document.getElementById("regex");
const matchesCounter = document.getElementById("matchesCounter");
const matches = document.getElementById("matches");
const outputHighlight = document.getElementById("outputHighlight");

form.onsubmit = (e) => execute(e);

function execute(e) {
  e.preventDefault();

  const formData = new FormData(form);

  const regex = formData.get("regex");
  const target = formData.get("target");

  const results = execRegex(regex, target);

  showResults(results);
  highlightResult(results, target);
}

function execRegex(regex, target) {
  let results = [];
  let result = null;

  const regexObject = new RegExp(regex, "g");

  while ((result = regexObject.exec(target))) {
    if (!result[0]) {
      throw new Error("Regex failed");
    }

    results.push(resultGen(result[0], result.index, regexObject.lastIndex));
  }

  return results;
}

function resultGen(result, index, lastIndex) {
  return {
    result,
    startsIn: index,
    endsIn: lastIndex,
  };
}

function showResults(results) {
  const resultsArr = [];

  for (let result of results) {
    resultsArr.push(result.result);
  }

  matchesCounter.innerHTML = resultsArr.length;

  let resultsStr = resultsArr.toString();

  // if (resultsArr.length === 1) {
  //   resultsStr = resultsStr.split(" ");
  //   matchesCounter.innerHTML = resultsStr.length;
  //   matches.value = resultsStr.toString().replace(/,(?:)/g, " | ");
  //   return;
  // }

  if (resultsArr.length <= 0) {
    matches.value = "No matches";
    return;
  }
  //es2021
  // matches.value = resultsStr.replaceAll(",", " ");

  //with Regex
  matches.value = resultsStr.replace(/,(?:)/g, " | ");
}

function highlightResult(results, target) {
  let result = null;
  let html = "";
  let i = 0;

  while ((result = results.shift())) {
    html += `<span class="result">${Replace(
      target.substring(i, result.startsIn)
    )}</span>`;
    html += `<span class="result highlight">${Replace(
      target.substring(result.startsIn, result.endsIn)
    )}</span>`;
    i = result.endsIn;
  }

  if (target.length - i > 0) {
    html += `<span class="result">${Replace(
      target.substring(i, target.length)
    )}</span>`;
  }

  outputHighlight.innerHTML = html;
}

function Replace(string) {
  return string
    .replace(/&/g, "&amp;")
    .replace(/"/, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
