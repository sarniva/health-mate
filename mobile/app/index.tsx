import { Redirect, type Href } from "expo-router";

export default function Index() {
  // TODO: check auth state and redirect accordingly
  const isLoggedIn = false;

  if (isLoggedIn) {
    return <Redirect href={"/(tabs)" as Href} />;
  }

  return <Redirect href={"/(auth)/login" as Href} />;
}
