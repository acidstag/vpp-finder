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
          {/* Header with Logo */}
          <Section style={header}>
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
              <tr>
                <td>
                  <Text style={logoText}>
                    <span style={{ color: colors.accent }}>⚡</span> VPP Finder
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Hero */}
          <Section style={heroSection}>
            <Text style={heroLabel}>YOUR PERSONALIZED RESULTS</Text>
            <Heading style={heroHeading}>
              We found your VPP match
            </Heading>
            <Text style={heroSubtext}>
              Based on your {battery} in {location}, here are your best options for earning passive income.
            </Text>
          </Section>

          {/* Setup Summary Card */}
          <Section style={setupCard}>
            <Text style={cardLabel}>YOUR SETUP</Text>
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
              <tr>
                <td style={setupItem}>
                  <Text style={setupLabel}>Battery</Text>
                  <Text style={setupValue}>{battery}</Text>
                </td>
                <td style={setupItem}>
                  <Text style={setupLabel}>Location</Text>
                  <Text style={setupValue}>{location} ({region})</Text>
                </td>
              </tr>
              <tr>
                <td style={setupItem}>
                  <Text style={setupLabel}>Solar</Text>
                  <Text style={setupValue}>{solar ? `${solar}kW` : 'None'}</Text>
                </td>
                <td style={setupItem}>
                  <Text style={setupLabel}>Retailer</Text>
                  <Text style={setupValue}>
                    {preference === 'open' ? 'Open to switch' : preference === 'keep' ? 'Keep current' : 'Need advice'}
                  </Text>
                </td>
              </tr>
            </table>
          </Section>

          {/* Top Match */}
          <Section style={topMatchSection}>
            <Text style={topMatchLabel}>TOP MATCH</Text>
            <Heading as="h2" style={topMatchHeading}>
              {topMatch.provider}
            </Heading>
            <Text style={topMatchName}>{topMatch.name}</Text>

            <Section style={earningsBox}>
              <Text style={earningsLabel}>ESTIMATED ANNUAL EARNINGS</Text>
              <Text style={earningsValue}>
                ${topMatch.earningsMin.toLocaleString()} - ${topMatch.earningsMax.toLocaleString()}
              </Text>
              <Text style={earningsSubtext}>per year</Text>
            </Section>

            <table cellPadding="0" cellSpacing="0" style={{ width: '100%', marginTop: '16px' }}>
              {!topMatch.retailerLockin && (
                <tr>
                  <td style={benefitRow}>
                    <Text style={checkmark}>✓</Text>
                    <Text style={benefitText}>No retailer switching required</Text>
                  </td>
                </tr>
              )}
              {topMatch.signupBonus > 0 && (
                <tr>
                  <td style={benefitRow}>
                    <Text style={checkmark}>✓</Text>
                    <Text style={benefitText}>${topMatch.signupBonus} sign-up bonus</Text>
                  </td>
                </tr>
              )}
              <tr>
                <td style={benefitRow}>
                  <Text style={checkmark}>✓</Text>
                  <Text style={benefitText}>Compatible with {battery}</Text>
                </td>
              </tr>
            </table>

            {topMatch.signupUrl && (
              <Button style={primaryButton} href={`${topMatch.signupUrl}?utm_source=vppfinder&utm_medium=email&utm_campaign=results`}>
                Sign Up to {topMatch.provider} →
              </Button>
            )}
          </Section>

          <Hr style={hr} />

          {/* Other Matches */}
          <Section style={section}>
            <Text style={cardLabel}>OTHER OPTIONS</Text>

            {otherMatches.map((match, index) => (
              <Section key={index} style={otherMatchCard}>
                <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
                  <tr>
                    <td>
                      <Text style={otherMatchProvider}>{match.provider}</Text>
                      <Text style={otherMatchDetails}>{match.highlight}</Text>
                    </td>
                    <td style={{ textAlign: 'right' as const, verticalAlign: 'top' }}>
                      <Text style={otherMatchEarnings}>Up to ${match.earningsMax}</Text>
                      <Text style={otherMatchPeriod}>/year</Text>
                    </td>
                  </tr>
                </table>
              </Section>
            ))}

            <Button style={secondaryButton} href={`${resultsUrl}&utm_source=email&utm_campaign=results`}>
              View Full Comparison →
            </Button>
          </Section>

          <Hr style={hr} />

          {/* Next Steps */}
          <Section style={section}>
            <Text style={cardLabel}>NEXT STEPS</Text>
            <table cellPadding="0" cellSpacing="0" style={{ width: '100%' }}>
              <tr>
                <td style={stepNumber}>1</td>
                <td style={stepText}>Review your matched programs above</td>
              </tr>
              <tr>
                <td style={stepNumber}>2</td>
                <td style={stepText}>Click through to sign up (takes 5-10 min)</td>
              </tr>
              <tr>
                <td style={stepNumber}>3</td>
                <td style={stepText}>Start earning within 1-2 weeks</td>
              </tr>
            </table>
          </Section>

          <Hr style={hr} />

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerBrand}>VPP Finder</Text>
            <Text style={footerText}>
              The free comparison tool for Australian battery owners
            </Text>
            <Text style={footerLinks}>
              <Link href="https://www.vppfinder.com.au" style={footerLink}>Website</Link>
              {' • '}
              <Link href="https://www.vppfinder.com.au/about" style={footerLink}>About</Link>
              {' • '}
              <Link href="https://www.vppfinder.com.au/unsubscribe" style={footerLink}>Unsubscribe</Link>
            </Text>
            <Text style={disclosureText}>
              VPP Finder may earn a commission when you sign up through our links. This does not affect our recommendations.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

// Brand Colors
const colors = {
  accent: '#10b981',
  accentLight: '#d1fae5',
  accentDark: '#065f46',
  foreground: '#0a0a0a',
  muted: '#737373',
  border: '#e5e5e5',
  background: '#fafafa',
  card: '#ffffff',
}

// Styles
const main = {
  backgroundColor: colors.background,
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
}

const container = {
  backgroundColor: colors.card,
  margin: '0 auto',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden',
  marginTop: '40px',
  marginBottom: '40px',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
}

const header = {
  padding: '32px 32px 24px',
  borderBottom: `1px solid ${colors.border}`,
}

const logoText = {
  fontSize: '20px',
  fontWeight: '700',
  color: colors.foreground,
  margin: '0',
  lineHeight: '1',
}

const heroSection = {
  padding: '32px',
  textAlign: 'center' as const,
}

const heroLabel = {
  fontSize: '11px',
  fontWeight: '600',
  color: colors.accent,
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 12px',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
}

const heroHeading = {
  fontSize: '28px',
  fontWeight: '700',
  color: colors.foreground,
  margin: '0 0 12px',
  lineHeight: '1.2',
}

const heroSubtext = {
  fontSize: '16px',
  color: colors.muted,
  margin: '0',
  lineHeight: '1.5',
}

const setupCard = {
  margin: '0 32px 32px',
  padding: '20px',
  backgroundColor: colors.background,
  borderRadius: '8px',
}

const cardLabel = {
  fontSize: '11px',
  fontWeight: '600',
  color: colors.muted,
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 16px',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
}

const setupItem = {
  padding: '8px 16px 8px 0',
  verticalAlign: 'top' as const,
}

const setupLabel = {
  fontSize: '11px',
  color: colors.muted,
  margin: '0 0 4px',
  textTransform: 'uppercase' as const,
  letterSpacing: '0.5px',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
}

const setupValue = {
  fontSize: '14px',
  fontWeight: '600',
  color: colors.foreground,
  margin: '0',
}

const topMatchSection = {
  padding: '0 32px 32px',
}

const topMatchLabel = {
  fontSize: '11px',
  fontWeight: '600',
  color: colors.accent,
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
}

const topMatchHeading = {
  fontSize: '32px',
  fontWeight: '700',
  color: colors.foreground,
  margin: '0',
  lineHeight: '1.2',
}

const topMatchName = {
  fontSize: '16px',
  color: colors.muted,
  margin: '4px 0 20px',
}

const earningsBox = {
  backgroundColor: colors.accentLight,
  borderRadius: '8px',
  padding: '24px',
  textAlign: 'center' as const,
}

const earningsLabel = {
  fontSize: '11px',
  fontWeight: '600',
  color: colors.accentDark,
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '0 0 8px',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
}

const earningsValue = {
  fontSize: '36px',
  fontWeight: '700',
  color: colors.accentDark,
  margin: '0',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
}

const earningsSubtext = {
  fontSize: '14px',
  color: colors.accentDark,
  margin: '4px 0 0',
}

const benefitRow = {
  padding: '6px 0',
}

const checkmark = {
  display: 'inline',
  color: colors.accent,
  fontWeight: '700',
  marginRight: '8px',
  fontSize: '14px',
}

const benefitText = {
  display: 'inline',
  fontSize: '14px',
  color: colors.foreground,
  margin: '0',
}

const primaryButton = {
  backgroundColor: colors.accent,
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '14px 24px',
  marginTop: '24px',
}

const hr = {
  borderColor: colors.border,
  borderWidth: '1px',
  borderStyle: 'solid',
  margin: '0 32px',
}

const section = {
  padding: '32px',
}

const otherMatchCard = {
  padding: '16px',
  backgroundColor: colors.background,
  borderRadius: '6px',
  marginBottom: '12px',
}

const otherMatchProvider = {
  fontSize: '16px',
  fontWeight: '600',
  color: colors.foreground,
  margin: '0 0 4px',
}

const otherMatchDetails = {
  fontSize: '13px',
  color: colors.muted,
  margin: '0',
}

const otherMatchEarnings = {
  fontSize: '18px',
  fontWeight: '700',
  color: colors.foreground,
  margin: '0',
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
}

const otherMatchPeriod = {
  fontSize: '12px',
  color: colors.muted,
  margin: '0',
}

const secondaryButton = {
  backgroundColor: colors.card,
  border: `2px solid ${colors.border}`,
  borderRadius: '6px',
  color: colors.foreground,
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 24px',
  marginTop: '16px',
}

const stepNumber = {
  width: '28px',
  height: '28px',
  backgroundColor: colors.foreground,
  color: colors.card,
  borderRadius: '50%',
  textAlign: 'center' as const,
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '28px',
  verticalAlign: 'top' as const,
  fontFamily: 'Consolas, Monaco, "Courier New", monospace',
}

const stepText = {
  fontSize: '14px',
  color: colors.foreground,
  margin: '0',
  paddingLeft: '12px',
  paddingBottom: '12px',
  verticalAlign: 'top' as const,
  lineHeight: '28px',
}

const footer = {
  padding: '32px',
  textAlign: 'center' as const,
  backgroundColor: colors.background,
}

const footerBrand = {
  fontSize: '16px',
  fontWeight: '700',
  color: colors.foreground,
  margin: '0 0 4px',
}

const footerText = {
  fontSize: '13px',
  color: colors.muted,
  margin: '0 0 16px',
}

const footerLinks = {
  fontSize: '13px',
  color: colors.muted,
  margin: '0 0 16px',
}

const footerLink = {
  color: colors.muted,
  textDecoration: 'underline',
}

const disclosureText = {
  fontSize: '11px',
  color: '#a3a3a3',
  margin: '0',
  lineHeight: '1.5',
}

export default ResultsEmail
