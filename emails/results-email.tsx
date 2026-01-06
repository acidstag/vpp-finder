import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'

interface ResultsEmailProps {
  battery: string
  location: string
  region: string
  solar: string | number | null
  preference: string
  topMatch: {
    provider: string
    name: string
    earningsMin: number
    earningsMax: number
    signupBonus: number
    retailerLockin: boolean
    signupUrl?: string
  }
  otherMatches: Array<{
    provider: string
    name: string
    earningsMax: number
    highlight: string
  }>
  resultsUrl: string
}

export function ResultsEmail({
  battery = 'Tesla Powerwall',
  location = '2000',
  region = 'NSW',
  solar = '6.6',
  preference = 'open',
  topMatch = {
    provider: 'Amber Electric',
    name: 'SmartShift',
    earningsMin: 1200,
    earningsMax: 1500,
    signupBonus: 0,
    retailerLockin: false,
    signupUrl: 'https://www.amber.com.au',
  },
  otherMatches = [
    { provider: 'AGL', name: 'VPP', earningsMax: 600, highlight: 'Major retailer reliability' },
    { provider: 'Origin', name: 'Loop', earningsMax: 400, highlight: '$200 sign-up bonus' },
    { provider: 'ShineHub', name: 'Community VPP', earningsMax: 700, highlight: 'Keep current retailer' },
  ],
  resultsUrl = 'https://vppfinder.com.au/results',
}: ResultsEmailProps) {
  const previewText = `Your VPP results: ${topMatch.provider} could earn you $${topMatch.earningsMax}/year`

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Text style={logo}>VPP Finder</Text>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Heading style={heroHeading}>Your VPP Match Results</Heading>
            <Text style={heroSubtext}>
              We found programs that match your {battery} in {location}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Your Setup */}
          <Section style={section}>
            <Text style={sectionLabel}>YOUR SETUP</Text>
            <Text style={setupText}>
              <strong>Battery:</strong> {battery}<br />
              <strong>Location:</strong> {location} ({region})<br />
              {solar && <><strong>Solar:</strong> {solar}kW<br /></>}
              <strong>Retailer Preference:</strong> {preference === 'open' ? 'Open to switch' : preference === 'keep' ? 'Keep current' : 'Need advice'}
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Top Match */}
          <Section style={topMatchSection}>
            <Text style={topMatchLabel}>YOUR TOP MATCH</Text>
            <Heading as="h2" style={topMatchHeading}>
              {topMatch.provider} {topMatch.name}
            </Heading>

            <Section style={earningsBox}>
              <Text style={earningsLabel}>Estimated Annual Earnings</Text>
              <Text style={earningsValue}>
                ${topMatch.earningsMin.toLocaleString()} - ${topMatch.earningsMax.toLocaleString()}
              </Text>
              <Text style={earningsSubtext}>per year</Text>
            </Section>

            <Section style={benefitsList}>
              {!topMatch.retailerLockin && (
                <Text style={benefitItem}>No retailer switching required</Text>
              )}
              {topMatch.signupBonus > 0 && (
                <Text style={benefitItem}>${topMatch.signupBonus} sign-up bonus</Text>
              )}
              <Text style={benefitItem}>Works with your {battery}</Text>
            </Section>

            {topMatch.signupUrl && (
              <Button style={primaryButton} href={`${topMatch.signupUrl}?utm_source=vppfinder&utm_medium=email&utm_campaign=results`}>
                Sign Up to {topMatch.provider}
              </Button>
            )}
          </Section>

          <Hr style={hr} />

          {/* Other Matches */}
          <Section style={section}>
            <Text style={sectionLabel}>OTHER GREAT OPTIONS</Text>

            {otherMatches.map((match, index) => (
              <Section key={index} style={otherMatchRow}>
                <Text style={otherMatchName}>
                  {index + 2}. {match.provider} {match.name}
                </Text>
                <Text style={otherMatchDetails}>
                  Up to ${match.earningsMax}/year - {match.highlight}
                </Text>
              </Section>
            ))}

            <Button style={secondaryButton} href={`${resultsUrl}?utm_source=email&utm_campaign=results`}>
              View Full Comparison
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Next Steps */}
          <Section style={section}>
            <Text style={sectionLabel}>NEXT STEPS</Text>
            <Text style={nextStepsText}>
              1. Review the programs above<br />
              2. Click through to sign up (takes 5-10 min)<br />
              3. Start earning within 1-2 weeks
            </Text>
            <Text style={helpText}>
              Questions? Just reply to this email - we read everything.
            </Text>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              VPP Finder | vppfinder.com.au
            </Text>
            <Text style={footerText}>
              You're receiving this because you used VPP Finder to compare programs.
            </Text>
            <Link href="https://vppfinder.com.au/unsubscribe" style={unsubscribeLink}>
              Unsubscribe
            </Link>
            <Text style={disclosureText}>
              VPP Finder may earn a commission when you sign up through our links.
              This does not affect our recommendations.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
}

const header = {
  padding: '24px 32px',
}

const logo = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#0a0a0a',
  margin: '0',
}

const heroSection = {
  padding: '0 32px',
  textAlign: 'center' as const,
}

const heroHeading = {
  fontSize: '28px',
  fontWeight: '700',
  color: '#0a0a0a',
  margin: '0 0 8px',
}

const heroSubtext = {
  fontSize: '16px',
  color: '#666666',
  margin: '0',
}

const hr = {
  borderColor: '#e6ebf1',
  margin: '24px 32px',
}

const section = {
  padding: '0 32px',
}

const sectionLabel = {
  fontSize: '11px',
  fontWeight: '600',
  color: '#8898aa',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  margin: '0 0 12px',
}

const setupText = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0',
}

const topMatchSection = {
  padding: '0 32px',
}

const topMatchLabel = {
  fontSize: '11px',
  fontWeight: '600',
  color: '#10b981',
  letterSpacing: '0.5px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
}

const topMatchHeading = {
  fontSize: '24px',
  fontWeight: '700',
  color: '#0a0a0a',
  margin: '0 0 16px',
}

const earningsBox = {
  backgroundColor: '#f0fdf4',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
  marginBottom: '16px',
}

const earningsLabel = {
  fontSize: '12px',
  color: '#166534',
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
}

const earningsValue = {
  fontSize: '32px',
  fontWeight: '700',
  color: '#166534',
  margin: '0',
}

const earningsSubtext = {
  fontSize: '14px',
  color: '#166534',
  margin: '4px 0 0',
}

const benefitsList = {
  margin: '16px 0',
}

const benefitItem = {
  fontSize: '14px',
  color: '#525f7f',
  margin: '0 0 8px',
  paddingLeft: '20px',
  position: 'relative' as const,
}

const primaryButton = {
  backgroundColor: '#10b981',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
  marginTop: '16px',
}

const secondaryButton = {
  backgroundColor: '#ffffff',
  border: '1px solid #e6ebf1',
  borderRadius: '6px',
  color: '#0a0a0a',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  marginTop: '16px',
}

const otherMatchRow = {
  marginBottom: '12px',
}

const otherMatchName = {
  fontSize: '15px',
  fontWeight: '600',
  color: '#0a0a0a',
  margin: '0',
}

const otherMatchDetails = {
  fontSize: '13px',
  color: '#8898aa',
  margin: '2px 0 0',
}

const nextStepsText = {
  fontSize: '14px',
  lineHeight: '24px',
  color: '#525f7f',
  margin: '0 0 16px',
}

const helpText = {
  fontSize: '14px',
  color: '#8898aa',
  margin: '0',
  fontStyle: 'italic',
}

const footer = {
  padding: '0 32px',
  textAlign: 'center' as const,
}

const footerText = {
  fontSize: '12px',
  color: '#8898aa',
  margin: '0 0 4px',
}

const unsubscribeLink = {
  fontSize: '12px',
  color: '#8898aa',
  textDecoration: 'underline',
}

const disclosureText = {
  fontSize: '11px',
  color: '#b0b0b0',
  margin: '16px 0 0',
  lineHeight: '16px',
}

export default ResultsEmail
