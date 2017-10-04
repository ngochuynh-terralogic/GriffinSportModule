import _ from 'lodash';
import React, { Component, PropTypes } from 'react';
import Timestamp from 'components/custom/griffin/Timestamp';

class SportModule extends Component {
  static propTypes = {
    FRN_rawResponses: PropTypes.array,
    sidePaneBackgroundColor: PropTypes.string,
    transparency: PropTypes.number,
    timestampOptions: PropTypes.shape({
      showElapsedTime: PropTypes.bool,
      displayShortDateTime: PropTypes.bool
    })
  }

  static defaultProps = {
    sidePaneBackgroundColor: 'black',
    transparency: 0.7,
  }

  render() {
    const {
      FRN_rawResponses: [
        {
          data: {
            features: items = [],
          } = {}
        } = {}
      ] = [],
      sidePaneBackgroundColor,
      transparency,
      textColor = '#FFF',
      timestampOptions: {
        showElapsedTime,
        displayShortDateTime
      } = {},
    } = this.props;
    const filteredItems = items.filter(item => _.includes(['story', 'clip', 'link'], _.toLower(item.type)));
    const itemsToShow = filteredItems.slice(0, 7);

    if (!itemsToShow.length) {
      return null;
    }

    const {
      headline = '',
      publishedDate: publishDate = '',
      abstractimage: {
        filename: newsImage = ''
      },
      link = '',
      type = '',
      id = '',
      url = '',
      seo: { pageurl: slug = ''} = {}
    } = _.head(itemsToShow);

    const tail = _.tail(itemsToShow);

    const ListComponent = (
      <List
        items={tail}
        showElapsedTime={showElapsedTime}
        displayShortDateTime={displayShortDateTime}
        textColor={textColor}
      />
    );

    return (
      <div className="SportModule">
        <div className='SportModule-container'>
          <div className='SportModule-container-items'>
            <img src={newsImage}/>
            <div className='SportModule-container-items-textCell'>
              <ItemLink article={{ id, type, slug, link: url || link }}/>
              <h4 className='SportModule-container-items-textCell--title' style={{color: textColor}}>{headline}</h4>
              <div className='SportModule-container-items-textCell--timeStamp'>
                <Timestamp publishDate={publishDate} showElapsedTime={showElapsedTime} displayShortDateTime={displayShortDateTime}/>
              </div>
            </div>
          </div>
          <div className='SportModule-container-listContainer'>
            <span className='SportModule-container-listContainer--background' style={{ backgroundColor: sidePaneBackgroundColor, opacity: transparency}}/>
            {ListComponent}
          </div>
        </div>
      </div>
    )
  }
}

class List extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    showElapsedTime: PropTypes.bool,
    displayShortDateTime: PropTypes.bool
  }

  static defaultProps = {
    items: [],
  }

  render() {
    const {
      items,
      showElapsedTime,
      displayShortDateTime,
      textColor
    } = this.props;

    const itemComponents =
      _.map(items, (item, i) =>
        <Item key={i}
              item={item}
              isLast={i === (items.length - 1) ? true : false}
              showElapsedTime={showElapsedTime}
              displayShortDateTime={displayShortDateTime}
              textColor={textColor}
        />);

    return (
      <div className='List'>
        {itemComponents}
      </div>
    );
  }
}

class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired,
    isLast: PropTypes.bool,
    showElapsedTime: PropTypes.bool,
    displayShortDateTime: PropTypes.bool
  }

  render() {
    const {
      item: {
        headline = '',
        link = '',
        type = '',
        id = '',
        url = '',
        seo: { pageurl: slug = ''} = {},
        publishedDate: publishDate = ''
      } = {},
      showElapsedTime,
      displayShortDateTime,
      isLast,
      textColor
    } = this.props;

    return (
      <div className='Item'>
        <div className='Item-container'>
          <ItemLink article={{ id, type, slug, link: url || link }}/>
          <div className='ItemTextArea'>
            <h4 className='ItemTextArea-title' style={{color: textColor}}>{headline}</h4>
            <Timestamp publishDate={publishDate} showElapsedTime={showElapsedTime} displayShortDateTime={displayShortDateTime}/>
          </div>
        </div>
      </div>
    );
  }
}

class ItemLink extends Component {
  static propTypes = {
    article: PropTypes.object.isRequired,
    linkToLegacy: PropTypes.bool
  }

  render() {
    const {
      article: {
        type,
        id,
        slug,
        link: fallbackLink
      } = {},
      linkToLegacy = false
    } = this.props;

    const href = (type !== 'link' && (typeof location !== 'undefined' && !linkToLegacy)) ?
      location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/' + type + '/' + id + '/' + slug :
      fallbackLink;

    return (
      <a className='ItemLink' href={href} target='_top' />
    );
  }
}

export default SportModule;
