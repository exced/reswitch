import React from "react";
import { StyleSheet, Text, View } from "react-native";

import Switch, { SwitchProps, Size } from "./lib/Switch";

class ControlledSwitch extends React.Component<
  SwitchProps,
  { value: boolean }
> {
  public state = {
    value: false
  };

  public render() {
    return (
      <Switch
        value={this.state.value}
        onValueChange={this.handleValueChange}
        {...this.props}
      />
    );
  }

  private handleValueChange = (value: boolean) => {
    this.setState({ value });
  };
}

export default class App extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <Text>Disabled</Text>
        <View style={styles.spacing}>
          <ControlledSwitch disabled={true} />
        </View>
        <Text>Small</Text>
        <View style={styles.spacing}>
          <ControlledSwitch size={Size.small} />
        </View>
        <Text>Default</Text>
        <View style={styles.spacing}>
          <ControlledSwitch />
        </View>
        <Text>Active color</Text>
        <View style={styles.spacing}>
          <ControlledSwitch activeColor="palevioletred" />
        </View>
        <Text>Inactive color</Text>
        <View style={styles.spacing}>
          <ControlledSwitch inactiveColor="white" />
        </View>
        <Text>Large</Text>
        <View style={styles.spacing}>
          <ControlledSwitch size={Size.large} />
        </View>
        <Text>Children</Text>
        <View style={styles.spacing}>
          <ControlledSwitch
            size={Size.large}
            activeChildren={
              <Text style={{ fontSize: 22, color: "white" }}>V</Text>
            }
            inactiveChildren={
              <Text style={{ fontSize: 22, color: "white" }}>X</Text>
            }
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  },
  spacing: { marginTop: 10 }
});
