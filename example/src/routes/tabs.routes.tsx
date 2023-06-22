import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Home } from "../screens/home";
import { Profile } from "../screens/profile";
import { Text } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Step } from "react-native-spotlight-tour";

type TabParamList = {
  Home: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const Tabs = () => {
  const { navigate } = useNavigation<NavigationProp<TabParamList>>();

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: () => (
            <Step
              order={5}
              text="Press here to go to profile screen"
              tourKey="tour-one"
              onPress={() => navigate("Profile")}
            >
              <Text>Home</Text>
            </Step>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
