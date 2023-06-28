import { createStackNavigator } from "@react-navigation/stack";
import { Tabs } from "./tabs.routes";

type StackParamList = {
  Tabs: undefined;
};

const Stack = createStackNavigator<StackParamList>();

export const StackRoutes = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tabs" component={Tabs} />
    </Stack.Navigator>
  );
};
