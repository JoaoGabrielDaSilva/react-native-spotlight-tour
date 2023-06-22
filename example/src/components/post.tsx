import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { Step } from "react-native-spotlight-tour-guide";

const { width } = Dimensions.get("window");

export const Post = () => {
  return (
    <View style={styles.container}>
      <Step
        name="show-post-owner"
        tourKeys={["tour-one"]}
        style={{ marginBottom: 12 }}
      >
        <View style={styles.header}>
          <Image
            style={styles.avatarImage}
            source={{
              uri: "https://media.sproutsocial.com/uploads/2022/06/profile-picture.jpeg",
            }}
          />
          <View>
            <Text style={styles.name}>João Gabriel</Text>
          </View>
        </View>
      </Step>
      <Step name="show-post-image" tourKeys={["tour-one"]} style={{ flex: 1 }}>
        <Image
          source={{
            uri: "https://cdn.visualwilderness.com/wp-content/uploads/2019/10/DSC06179-Edit.jpg",
          }}
          style={styles.postImage}
        />
      </Step>
      <Step
        name="show-post-action-bar"
        tourKeys={["tour-one"]}
        style={{ marginTop: 12 }}
      >
        <View style={styles.footer}>
          <Step name="show-post-like-button" tourKeys={["tour-one"]}>
            <Text style={styles.action}>Like</Text>
          </Step>
          <Step name="show-post-comment-button" tourKeys={["tour-one"]}>
            <Text style={styles.action}>Action</Text>
          </Step>
        </View>
      </Step>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  header: {
    flexDirection: "row",
  },
  name: {
    marginTop: 6,
    fontSize: 16,
  },

  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  postImage: {
    height: width * 0.7,

    borderRadius: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  action: {
    fontSize: 16,
    flex: 1,
    textAlign: "center",
  },
});
