import React from 'react';
import { Link, withRouter } from 'react-router-dom';
import Route from 'route-parser';
import { connect } from 'react-redux';

const getPathTokens = pathname => {
  const paths = ['/'];

  if (pathname === '/') return paths;
  pathname.split('/').reduce((prev, curr) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  return paths;
};

const getRouteMatch = (routes, path) => {
  let foundKeys = [];
  Object.keys(routes).forEach(key => {
    let route = new Route(routes[key].path);
    if (route.match(path)) {
      foundKeys.push({ ...routes[key], foundMatch: route.match(path) });
    }
  });
  return foundKeys[0];
};

const getBreadcrumbs = ({ routes, match, location }) => {
  const pathTokens = getPathTokens(location.pathname);
  let returnArray = [];
  pathTokens.forEach((path, i) => {
    const routeMatch = getRouteMatch(routes, path);
    if (routeMatch) {
      const routeValue = routes[routeMatch.path];
      returnArray.push({
        ...routeValue,
        path,
        matchingPath: routeMatch.foundMatch
      });
    }
  });
  return returnArray;
};

class Breadcrumbs extends React.Component {
  constructor(props) {
    super(props);
    this.formatNameForBreadcrumb = this.formatNameForBreadcrumb.bind(this);
  }

  formatNameForBreadcrumb = breadcrumb => {
    if (breadcrumb.hasCustomName) {
      if (breadcrumb.customName.constructor === Object) {
        let collection = breadcrumb.customName.collection;
        let pathIdentifier = breadcrumb.customName.pathIdentifier;
        let usedId = breadcrumb.matchingPath[pathIdentifier];
        if (
          this.props[`${collection}`] &&
          this.props[`${collection}`][usedId]
        ) {
          return this.props[`${collection}`][usedId].name;
        } else return breadcrumb.name;
      } else {
        return breadcrumb.customName;
      }
    }
    return breadcrumb.name;
  };

  render = () => {
    const { routes, match, location } = this.props;
    const breadcrumbs = getBreadcrumbs({ routes, match, location });
    return (
      <nav aria-label="You are here:">
        <ul className="breadcrumbs">
          {breadcrumbs.map((breadcrumb, i) => {
            if (breadcrumb.path && breadcrumb.name) {
              let name = this.formatNameForBreadcrumb(breadcrumb);
              if (i === breadcrumbs.length - 1) {
                return (
                  <li key={breadcrumb.path}>
                    <span>{name}</span>
                  </li>
                );
              } else {
                return (
                  <li key={breadcrumb.path}>
                    <Link to={breadcrumb.path}>{name}</Link>
                  </li>
                );
              }
            } else {
              return null;
            }
          })}
        </ul>
      </nav>
    );
  };
}
const mapStateToProps = state => ({
  user: state.login.user,
  campaigns: state.campaigns.all,
  npcs: state.npcs.all,
  quests: state.quests.all,
  places: state.places.all
});

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(Breadcrumbs)
);
