import React from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Interactable } from "react-native-redash";
import Animated from "react-native-reanimated";

interface SnapPoint {
  x?: number;
  y?: number;
  damping?: number;
  tension?: number;
  id?: string;
}

interface SnapEvent {
  nativeEvent: SnapPoint & { index: number };
}

export enum Size {
  small = "small",
  default = "default",
  large = "large"
}

export interface SwitchProps {
  value?: boolean;
  onValueChange?: (value: boolean) => void;
  disabled?: boolean;
  size?: Size;
  activeColor?: string;
  inactiveColor?: string;
  activeChildren?: React.ReactNode;
  inactiveChildren?: React.ReactNode;
}

interface SwitchStyles {
  rowContainer: ViewStyle;
  inactiveChildrenContainer: ViewStyle;
  inactiveChildren: ViewStyle;
  activeChildrenContainer: ViewStyle;
  activeChildren: ViewStyle;
  knob: ViewStyle;
}

const { Extrapolate } = Animated;

const snapFactors = {
  damping: 0.7,
  tension: 300
};

/**
 * Switch
 */
export default class Switch extends React.Component<SwitchProps> {
  /**
   * Animated delta x
   */
  private deltaX = new Animated.Value(0);

  /**
   * Interactable Ref
   */
  private readonly interactableRef: React.RefObject<any> = React.createRef();

  public render() {
    const {
      value,
      disabled = false,
      size = Size.default,
      activeColor = "#1890ff",
      inactiveColor = "rgba(0, 0, 0, 0.25)",
      activeChildren,
      inactiveChildren
    } = this.props;

    const styles = getStyles(size);

    const positions = getPositions(size);

    const snapPoints = [
      { ...positions.inactive, ...snapFactors },
      { ...positions.active, ...snapFactors }
    ];

    const boundaries = {
      left: 0,
      right: positions.active.x
    };

    const initialPosition = value ? positions.active : positions.inactive;

    const activeOpacity = this.deltaX.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
      extrapolate: Extrapolate.CLAMP
    });
    const inactiveOpacity = this.deltaX.interpolate({
      inputRange: [0, 1],
      outputRange: [1, 0.3],
      extrapolate: Extrapolate.CLAMP
    });
    return (
      <View style={styles.rowContainer}>
        <TouchableWithoutFeedback
          disabled={disabled}
          onPress={this.handlePress}
        >
          {value ? (
            <Animated.View
              style={[
                styles.activeChildrenContainer,
                { backgroundColor: activeColor },
                { opacity: activeOpacity }
              ]}
            >
              <View style={styles.activeChildren}>{activeChildren}</View>
            </Animated.View>
          ) : (
            <Animated.View
              style={[
                styles.inactiveChildrenContainer,
                { backgroundColor: inactiveColor },
                { opacity: inactiveOpacity }
              ]}
            >
              <View style={styles.inactiveChildren}>{inactiveChildren}</View>
            </Animated.View>
          )}
          {disabled ? (
            <View style={styles.knob} />
          ) : (
            <Interactable
              ref={this.interactableRef}
              horizontalOnly={true}
              onSnap={this.handleSnap}
              initialPosition={initialPosition}
              snapPoints={snapPoints}
              boundaries={boundaries}
              animatedValueX={this.deltaX}
            >
              <View style={styles.knob} />
            </Interactable>
          )}
        </TouchableWithoutFeedback>
      </View>
    );
  }

  private handlePress = () => {
    if (this.interactableRef.current) {
      this.interactableRef.current.snapTo({ index: this.props.value ? 0 : 1 });
    }
    if (this.props.onValueChange) {
      this.props.onValueChange(!this.props.value);
    }
  };

  private handleSnap = (e: SnapEvent) => {
    if (this.props.onValueChange) {
      this.props.onValueChange(e.nativeEvent.index === 1);
    }
  };
}

const containerSize: { [size: string]: ViewStyle } = {
  [Size.small]: {
    height: 23,
    width: 40,
    borderRadius: 12
  },
  [Size.default]: {
    height: 31,
    width: 51,
    borderRadius: 15
  },
  [Size.large]: {
    height: 36,
    width: 78,
    borderRadius: 25
  }
};
const knobSize: {
  [size: string]: { height: number; width: number; borderRadius: number };
} = {
  [Size.small]: {
    height: 21,
    width: 21,
    borderRadius: 12
  },
  [Size.default]: {
    height: 29,
    width: 29,
    borderRadius: 15
  },
  [Size.large]: {
    height: 34,
    width: 34,
    borderRadius: 20
  }
};

const activePositions: { [size: string]: { x: number; y: number } } = {
  [Size.small]: {
    x: 18,
    y: 0
  },
  [Size.default]: {
    x: 21,
    y: 0
  },
  [Size.large]: {
    x: 43,
    y: 0
  }
};

const getPositions = (size: Size) => ({
  inactive: { x: 0, y: 0 },
  active: activePositions[size]
});

const getStyles = (size: Size) =>
  StyleSheet.create<SwitchStyles>({
    rowContainer: {
      width: containerSize[size].width,
      height: containerSize[size].height,
      backgroundColor: "white",
      borderRadius: containerSize[size].borderRadius,
      borderWidth: 1,
      borderColor: "rgba(0,0,0,0.1)",
      overflow: "hidden"
    },
    inactiveChildrenContainer: {
      position: "absolute",
      right: 0,
      top: 0,
      width: "100%",
      height: "100%"
    },
    activeChildrenContainer: {
      position: "absolute",
      left: 0,
      top: 0,
      width: "100%",
      height: "100%"
    },
    activeChildren: {
      top: 2,
      left: (knobSize[size].height || 0) / 2,
      position: "absolute"
    },
    inactiveChildren: {
      top: 2,
      right: (knobSize[size].height || 0) / 2,
      position: "absolute"
    },
    knob: {
      height: knobSize[size].height,
      width: knobSize[size].width,
      backgroundColor: "white",
      borderWidth: 0.5,
      borderColor: "rgba(0,0,0,0.3)",
      borderRadius: knobSize[size].borderRadius
    }
  });
