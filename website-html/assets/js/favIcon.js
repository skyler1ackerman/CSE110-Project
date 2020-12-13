lightSchemeIcon = document.querySelector("link#light-scheme-icon");
darkSchemeIcon = document.querySelector("link#dark-scheme-icon");

async function onUpdate() {
  if (matcher.matches) {
    lightSchemeIcon.remove();
    document.head.append(darkSchemeIcon);
  } else {
    document.head.append(lightSchemeIcon);
    console.log(darkSchemeIcon);
    darkSchemeIcon.remove();
  }
}

matcher = window.matchMedia('(prefers-color-scheme: dark)');
matcher.addListener(onUpdate);
onUpdate();
