import { createStackNavigator } from "@react-navigation/stack";
import { Stories } from "../screens/stories";
import { Tabs } from "./tabs.routes";

type StackParamList = {
  // Stories: undefined;
  Tabs: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export const StackRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* <Stack.Screen name="Stories" component={Stories} /> */}
      <Stack.Screen name="Tabs" component={Tabs} />
    </Stack.Navigator>
  );
};
