import React, { useEffect, useState } from "react";
import { Container, Table, Button, Col, Row, Spinner } from "reactstrap";
import axios, { AxiosResponse } from "axios";

interface ServerResponse {
  data: Crawl[];
}

interface Crawl {
  pageUrl: string;
  pageTitle: string;
  pageDescription: string;
  pageHeadings: Array<string>;
}

const initialCrawlData: Array<Crawl> = [
  {
    pageUrl: "",
    pageTitle: "",
    pageDescription: "",
    pageHeadings: [],
  },
];

const App = () => {
  const [crawlData, setCrawlData] = useState<Array<Crawl>>(initialCrawlData);
  const [tableShow, setTableShow] = useState(false);
  const [click, setClick] = useState(false);

  // API call
  useEffect(() => {
    if (tableShow === true) {
      const intervalId = setInterval(() => {
        axios
          .get("http://localhost:8021/crawl")
          .then((response: AxiosResponse<ServerResponse>) => {
            console.log("res", response);
            setCrawlData(response.data.data);
          });
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [tableShow]);

  const handleClick = () => {
    setClick(true);
    axios
      .post("http://localhost:8021/crawl")
      .then((response: AxiosResponse<ServerResponse>) => {
        console.log("res", response.data.data);
        axios
          .get("http://localhost:8021/crawl")
          .then((response: AxiosResponse<ServerResponse>) => {
            console.log("res", response);
            setCrawlData(response.data.data);
            setClick(false);
            setTableShow(true);
          });
      });
  };

  return (
    <Container>
      <div>
        {tableShow === false ? (
          <Row>
            <Col></Col>
            <Col>
              {click === true ? (
                "Loading...."
              ) : (
                <Button onClick={() => handleClick()} className="mt-5">
                  Start Crawling
                </Button>
              )}
            </Col>
            <Col></Col>
          </Row>
        ) : (
          <Table responsive bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Page Url</th>
                <th>Title</th>
                <th>Description</th>
                <th>Headings</th>
              </tr>
            </thead>
            <tbody>
              {crawlData.length > 0 ? (
                crawlData.map((data, i) => (
                  <tr>
                    <th scope="row">{i + 1}</th>
                    <td>
                      <a href={data.pageUrl}>{data.pageUrl}</a>
                    </td>
                    <td>{data.pageTitle}</td>
                    <td>{data.pageDescription}</td>
                    <td>
                      <ul>
                        {data.pageHeadings.map((heading) => (
                          <li>{heading}</li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>No data available</tr>
              )}
            </tbody>
          </Table>
        )}
      </div>
    </Container>
  );
};

export default App;
