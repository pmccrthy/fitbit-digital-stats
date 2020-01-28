const colourSet = [
  {color: "red"}, 
  {color: "#F83C40"},
  {color: "crimson"},
  {color: "deeppink"},
  {color: "pink"},
  {color: "orangered"},
  {color: "orange"},
  {color: "#FFCC33"},
  {color: "yellow"},
  {color: "#B8FC68"},
  {color: "darkgreen"},
  {color: "seagreen"},
  {color: "olivedrab"},
  {color: "lightgreen"},
  {color: "teal"},
  {color: "lightskyblue"},
  {color: "deepskyblue"},
  {color: "dodgerblue"},
  {color: "blue"},
  {color: 'mediumpurple'},
  {color: 'purple'},
  {color: "lightgrey"},
  {color: "grey"},
  {color: "white"} 
];

function mySettings(props) {
  return (
    <Page>
      <Section title={<Text bold align="center">PrimaryColor</Text>}>
        <ColorSelect
          settingsKey="primaryColour"
          colors={colourSet}
        />
      </Section>
      <Section title={<Text bold align="center">Secondary Color</Text>}>
        <ColorSelect
          settingsKey="secondaryColour"
          colors={colourSet}
        />
      </Section>
      <Section>
        <Toggle
          settingsKey="showBackgroundGradient"
          label={`Show Gradient: `}
        />
      </Section>
    </Page>
  );
}

registerSettingsPage(mySettings);
