/*
    - PageTemplate provides a template to create a new page.
    - The child element(s) of <PageTemplate> will be added to the content area.
*/

import Head from "next/head";
import { Header } from "../../components/Header";
import css from "./PageLayout.scss";

export class PageLayout extends React.Component {
  render() {
    const wrapper = this.props.wrapperPadding
      ? `${css.wrapper} ${css["wrapper-padding"]}`
      : css.wrapper;
    return (
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
          />
          <meta
            httpEquiv="Cache-Control"
            content="no-cache, no-store, must-revalidate"
          />
          <title>Wallet</title>
        </Head>

        <div id="page">
          <Header className={this.props.headers} />
          <main className={wrapper}>{this.props.children}</main>
        </div>
      </React.Fragment>
    );
  }
}
