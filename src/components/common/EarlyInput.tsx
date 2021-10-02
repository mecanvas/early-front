import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { useEffect, useMemo } from 'react';
import { useSpring, animated } from 'react-spring';

const Container = styled.div`
  width: 100%;
`;

const IsRequire = styled.span`
  margin-left: 0.5em;
  color: ${({ theme }) => theme.color.red};
  font-weight: bold;
`;

const BasicInput = styled.input<{ required: boolean }>`
  ${({ required, theme }) =>
    // pass = gray
    required
      ? css`
          border: 1px solid ${theme.color.gray300};
        `
      : css`
          border: 1px solid ${theme.color.red} !important;
        `}
  padding: 0.5em 1em;
  border-radius: 8px;
`;

const FailMessage = styled.small`
  color: ${({ theme }) => theme.color.red};
  font-size: 11px;
`;

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  isRequire?: boolean;
  valid?: 'pass' | 'fail';
  failMessage?: string;
  ruleMessage?: string;
}

const EarlyInput = ({
  isRequire = false,
  valid = 'pass',
  failMessage = '필수 값입니다.',
  ruleMessage,
  ...props
}: Props) => {
  const passOrFail = useMemo(() => {
    if (ruleMessage) {
      return 'fail';
    }
    if (isRequire) {
      return valid;
    } else {
      return 'pass';
    }
  }, [isRequire, ruleMessage, valid]);

  const [vaildMessage, vaildMessageApi] = useSpring(() => {
    return {
      from: { opacity: 0, translateY: -15 },
      to: { opacity: 1, translateY: 0 },
      config: { duration: 150 },
    };
  });

  useEffect(() => {
    if (passOrFail === 'fail' || ruleMessage) {
      vaildMessageApi.update({
        from: { opacity: 0, translateY: -15 },
        to: { opacity: 1, translateY: 0 },
        config: { duration: 150 },
      });
      vaildMessageApi.start();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passOrFail, ruleMessage]);

  return (
    <Container>
      <BasicInput required={passOrFail === 'pass'} aria-required type="text" {...props} />
      {isRequire ? <IsRequire>*</IsRequire> : null}

      {passOrFail === 'fail' && (
        <animated.div style={vaildMessage}>
          <FailMessage>{ruleMessage ? ruleMessage : failMessage}</FailMessage>
        </animated.div>
      )}
    </Container>
  );
};

export default EarlyInput;
