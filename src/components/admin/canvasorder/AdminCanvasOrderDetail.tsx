import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import { Descriptions, Tag, Button } from 'antd';
import useSWR from 'swr';
import { adminGetFetcher } from 'src/fetcher';
import { CanvasOrderDetail } from 'src/interfaces/admin/CanvasOrderInterface';
import Loading from 'src/components/common/Loading';
import Img from 'src/components/common/Img';
import { dateFormat } from 'src/utils/dateFormat';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { theme } from 'src/style/theme';
import { ImgToDataURL } from 'src/utils/ImgToDataURL';

const AdminOrderDetail = () => {
  const router = useRouter();
  const {
    query: { canvasOrderId },
  } = router;

  const { data } = useSWR<CanvasOrderDetail>(canvasOrderId ? `/canvasorder/${canvasOrderId}` : null, adminGetFetcher);

  const [loading, setLoading] = useState(false);
  const handleImgDownload = useCallback(
    async (e) => {
      const { cmd } = e.currentTarget.dataset;
      if (!cmd || !data) return;
      setLoading(true);
      const a = document.createElement('a');
      const { originImgUrl, canvasFrameUrls, createdAt, username, orderNo, paperNames } = data;

      const downloadOriginImg = async () => {
        a.download = `${orderNo}_${dateFormat(createdAt)}_${username}_원본이미지`;
        a.href = await ImgToDataURL(`${originImgUrl}?${new Date().getTime()}`);
        a.click();
      };

      const downloadFrameImg = async () => {
        canvasFrameUrls.forEach(async (url: string, index: number) => {
          const a = document.createElement('a');
          const paperName = paperNames[index];
          a.download = await `${orderNo}_${dateFormat(createdAt)}_${username}_${paperName}`;
          a.href = await ImgToDataURL(`${url}?${new Date().getTime()}`);
          a.click();
        });
      };

      if (cmd === 'all') {
        downloadOriginImg();
        downloadFrameImg();
      }

      if (cmd === 'origin') {
        downloadOriginImg();
      }

      if (cmd === 'frame') {
        downloadFrameImg();
      }

      setLoading(false);
    },
    [data],
  );

  if (!data) {
    return <Loading loading={!data} />;
  }

  return (
    <div style={{ width: '1000px', margin: '0 auto', padding: '0 10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>{data.username}님의 주문</h2>
        <div>{dateFormat(data.createdAt)}</div>
      </div>
      <div style={{ display: 'flex' }}>
        <Button
          type="default"
          style={{ marginRight: '6px' }}
          loading={loading}
          onClick={handleImgDownload}
          data-cmd="all"
        >
          <FontAwesomeIcon icon={faDownload} fill={theme.color.primary} />
          <span style={{ marginLeft: '6px' }}>모두 다운로드</span>
        </Button>

        <Button
          type="default"
          style={{ marginRight: '6px' }}
          loading={loading}
          onClick={handleImgDownload}
          data-cmd="origin"
        >
          <FontAwesomeIcon icon={faDownload} fill={theme.color.primary} />
          <span style={{ marginLeft: '6px' }}>원본 다운로드</span>
        </Button>

        <Button
          type="default"
          style={{ marginRight: '6px' }}
          loading={loading}
          onClick={handleImgDownload}
          data-cmd="frame"
        >
          <FontAwesomeIcon icon={faDownload} fill={theme.color.primary} />
          <span style={{ marginLeft: '6px' }}>액자 다운로드</span>
        </Button>
      </div>

      <Descriptions
        labelStyle={{
          width: '150px',
          backgroundColor: '#fafbfc',
          borderBottom: `1px solid ${theme.color.gray200}`,
          padding: '4px 8px',
          textAlign: 'center',
        }}
        contentStyle={{
          backgroundColor: '#fff',
          borderBottom: `1px solid ${theme.color.gray200}`,
        }}
        bordered
        column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
      >
        <Descriptions.Item label="주문 번호">{data.orderNo}</Descriptions.Item>
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
