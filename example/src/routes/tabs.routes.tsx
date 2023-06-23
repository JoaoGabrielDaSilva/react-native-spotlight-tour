import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feed } from "../screens/feed";
import { Profile } from "../screens/profile";
import { Text } from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Step } from "react-native-spotlight-tour-guide";
import { Stories } from "../screens/stories";

type TabParamList = {
  Feed: undefined;
  Profile: undefined;
  Stories: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export const Tabs = () => {
  const { navigate } = useNavigation<NavigationProp<TabParamList>>();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Stories"
        component={Stories}
        options={{
          tabBarLabel: ({ children }) => (
            <Step
              name="show-stories-tab"
              tourKeys={["tour-one", "tour-two"]}
              onPress={() => navigate("Stories")}
            >
              <Text style={{ fontSize: 16 }}>{children}</Text>
            </Step>
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          tabBarLabel: ({ children }) => (
            <Step
              name="show-feed-tab"
              tourKeys={["tour-one", "tour-two"]}
              onPress={() => navigate("Feed")}
            >
              <Text style={{ fontSize: 16 }}>{children}</Text>
            </Step>
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          tabBarLabel: ({ children }) => (
            <Step
              name="show-profile-tab"
              tourKeys={["tour-one", "tour-two"]}
              onPress={() => navigate("Profile")}
            >
              <Text style={{ fontSize: 16 }}>{children}</Text>
            </Step>
          ),
        }}
      />
    </Tab.Navigator>
  );
};
