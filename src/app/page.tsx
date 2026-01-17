import Container from "@/app/_components/container";
import { HeroMission } from "@/app/_components/hero-mission";
import { Intro } from "@/app/_components/intro";
import { Services } from "@/app/_components/services";
import { TrustedBy } from "@/app/_components/trusted-by";

export default function Index() {
  return (
    <main>
      <Container>
        <Intro />
        <HeroMission />
        <TrustedBy />
        <Services />
      </Container>
    </main>
  );
}
