import React from 'react';
import styled from '@emotion/styled';
import ToolHeader from '../ToolHeader';
import { Button } from 'antd/lib/radio';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquare } from '@fortawesome/free-regular-svg-icons';

const SingleToolFactory = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #dbdbdb;
`;

const SingleTool = () => {
  return (
    <div>
      <ToolHeader />
      <SingleToolFactory>
        <div>
          <div>
            <Button>
              <FontAwesomeIcon icon={faSquare} />
            </Button>
          </div>
        </div>
      </SingleToolFactory>
    </div>
  );
};

export default SingleTool;
