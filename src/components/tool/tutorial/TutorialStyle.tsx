import styled from '@emotion/styled';

export const TutorialContainer = styled.div`
  padding: 2em 1.5em 1.5em 1.5em;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  h4 {
    margin-bottom: 1em;
  }
`;

export const TutorialDescriptions = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const BadgesItemList = styled.div`
  display: flex;
  align-items: center;
  margin: 0.5em 0;
  padding: 0 2em;
  p {
    margin: 0;
    margin-left: 0.6em;
  }
`;

const BadgesItem = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 9999px;
  background-color: ${({ theme }) => theme.color.primary};
  display: flex;
  justify-content: center;
  align-items: center;
  span {
    color: ${({ theme }) => theme.color.white};
    font-size: 15px;
  }
`;

export const BadgeNumberDesc = ({ count, desc }: { count: number; desc: string | React.ReactNode }) => {
  return (
    <BadgesItemList>
      <BadgesItem>
        <span>{count}</span>
      </BadgesItem>
      <p>{desc}</p>
    </BadgesItemList>
  );
};
