import { PropsWithChildren } from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

import { Colors } from '../constants/colors';
import { BrutalOffset } from '../constants/shadows';

type Props = PropsWithChildren<{
  offset?: number;
  pressed?: boolean;
  radius?: number;
  shadowColor?: string;
  style?: StyleProp<ViewStyle>;
}>;

/**
 * Simulates a hard, offset (non-blurred) neo-brutalist shadow using a solid
 * black layer behind the content, since native shadow/elevation APIs only
 * produce soft blurred shadows.
 */
export default function BrutalShadow({
  children,
  offset = BrutalOffset.md,
  pressed = false,
  radius = 8,
  shadowColor = Colors.border,
  style,
}: Props) {
  const pressOffset = offset / 2;

  return (
    <View style={{ paddingRight: offset, paddingBottom: offset }}>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: offset,
          left: offset,
          right: 0,
          bottom: 0,
          backgroundColor: shadowColor,
          borderRadius: radius,
        }}
      />
      <View
        style={[
          {
            borderRadius: radius,
            transform: [{ translateX: pressed ? pressOffset : 0 }, { translateY: pressed ? pressOffset : 0 }],
          },
          style,
        ]}
      >
        {children}
      </View>
    </View>
  );
}
