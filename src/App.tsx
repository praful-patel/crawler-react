import React, { useEffect, useState } from "react";
import { Container, Table } from "reactstrap";
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

  // API call
  useEffect(() => {
    axios
      .get("http://localhost:8021/crawl")
      .then((response: AxiosResponse<ServerResponse>) => {
        console.log("res", response);
        setCrawlData(response.data.data);
      });
  }, []);

  return (
    <Container>
      <div>
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
            {crawlData.length > 1 ? (
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
      </div>
    </Container>
  );
};

export default App;
