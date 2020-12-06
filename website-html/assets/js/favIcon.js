// lightSchemeIcon = document.querySelector("link[id=light-scheme-icon]");
// darkSchemeIcon = document.querySelector("link[id=dark-scheme-icon]");
// OR can be grabbed like ^
lightSchemeIcon = document.querySelector("link#light-scheme-icon");
darkSchemeIcon = document.querySelector("link#dark-scheme-icon");

async function onUpdate() {
  console.log(darkSchemeIcon);
  console.log("onupdate  called");
  if (matcher.matches) {
    console.log("one called");
    lightSchemeIcon.remove();
    document.head.append(darkSchemeIcon);
  } else {
    console.log("two called");
    document.head.append(lightSchemeIcon);
    console.log(darkSchemeIcon);
    darkSchemeIcon.remove();
  }
}

matcher = window.matchMedia('(prefers-color-scheme: dark)');
matcher.addListener(onUpdate);
onUpdate();
