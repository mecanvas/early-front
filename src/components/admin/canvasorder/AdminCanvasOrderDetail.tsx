import { useRouter } from 'next/router';
import React from 'react';
import { Descriptions, Tag } from 'antd';
import useSWR from 'swr';
import { adminGetFetcher } from 'src/fetcher';
import { CanvasOrderDetail } from 'src/interfaces/admin/CanvasOrderInterface';
import Loading from 'src/components/common/Loading';
import Img from 'src/components/common/Img';
import { dateFormat } from 'src/utils/dateFormat';

const AdminOrderDetail = () => {
  const router = useRouter();
  const {
    query: { canvasOrderId },
  } = router;

  const { data } = useSWR<CanvasOrderDetail>(canvasOrderId ? `/canvasorder/${canvasOrderId}` : null, adminGetFetcher);

  if (!data) {
    return <Loading loading={!data} />;
  }

  return (
    <div style={{ width: '1000px', margin: '0 auto', padding: '0 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>{data.username}님의 주문</h2>
        <div>{dateFormat(data.createdAt)}</div>
      </div>

      <Descriptions
        labelStyle={{
          width: '150px',
          backgroundColor: '#fafbfc',
          borderBottom: '1px solid #dbdbdb',
          padding: '4px 8px',
          textAlign: 'center',
        }}
        contentStyle={{
          backgroundColor: '#fff',
          borderBottom: '1px solid #dbdbdb',
        }}
        bordered
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="이름">{data.username}</Descriptions.Item>
        <Descriptions.Item label="이메일">{data.email}</Descriptions.Item>
        <Descriptions.Item label="원본 사진">
          <Img src={data.originImgUrl} alt="고객님의 원본 사진" />
        </Descriptions.Item>

        <Descriptions.Item label="액자로 찍은 사진">
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', margin: '4px 0' }}>
            {data.canvasFrameUrls.map((url, index) => (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  flexDirection: 'column',
                  margin: '10px',
                }}
              >
                <Tag
                  style={{
                    margin: 0,
                    width: '100%',
                    textAlign: 'center',
                    padding: '4px',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                  color="cyan"
                >
                  {data.paperNames[index]}
                </Tag>
                <Img bordered src={url} alt="찍은 액자 사진들" />
              </div>
            ))}
          </div>
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default AdminOrderDetail;
