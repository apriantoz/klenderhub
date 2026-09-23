import { Code2 } from "lucide-react"
import { Box, Button, Container, Flex, Text } from "@radix-ui/themes"

export default function Navbar() {
  return (
    /* Gunakan asChild lalu bungkus dengan tag <header> */
    <Box asChild className="sticky top-0 z-50 w-full border-b backdrop-blur-md">
      <header>
        <Container size="4" px="4">
          {/* Gunakan className Tailwind h-16 untuk mengatur tinggi */}
          <Flex className="h-16" align="center" justify="between">
            
            {/* Logo */}
            <Flex gap="3" align="center">
              <div className="rounded-lg bg-indigo-600 p-1.5 text-white">
                <Code2 className="h-5 w-5" />
              </div>
              <Text size="5" weight="bold">
                KaLender
              </Text>
            </Flex>

            {/* Navigasi Utama */}
            <Flex asChild gap="3" align="center">
              <nav>
                <Button variant="ghost" color="gray">
                  Jadwal
                </Button>
                <Button variant="ghost" color="gray">
                  Monitor
                </Button>
                <Button variant="ghost" color="gray">
                  Statistik
                </Button>
              </nav>
            </Flex>

            {/* Right Action Buttons */}
            <Flex gap="3" align="center">
              <Button variant="solid" highContrast>
                Login
              </Button>
            </Flex>

          </Flex>
        </Container>
      </header>
    </Box>
  )
}