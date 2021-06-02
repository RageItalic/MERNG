import React, { useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import { Menu } from 'semantic-ui-react'

const Navbar = (props) => {
  const pathName = useLocation().pathname.split("/")[1]
  const path = pathName === '/' || !pathName ? 'home' : pathName

  let [activeItem, setActiveItem] = useState(path)

  let handleItemClick = (e, { name }) => setActiveItem(name)

  return (
      <Menu pointing secondary size="massive" color="teal">
        <Menu.Item
          name='home'
          active={activeItem === 'home'}
          onClick={(e) => handleItemClick(e, {name: 'home'})}
          as={Link}
          to="/"
        />
        
        <Menu.Menu position='right'>
          <Menu.Item
            name='login'
            active={activeItem === 'login'}
            onClick={(e) => handleItemClick(e, {name: 'login'})}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name='register'
            active={activeItem === 'register'}
            onClick={(e) => handleItemClick(e, {name: 'register'})}
            as={Link}
            to="/register"
          />
          <Menu.Item
            name='logout'
            active={activeItem === 'logout'}
            onClick={(e) => handleItemClick(e, {name: 'logout'})}
            as={Link}
            to="/logout"
          />
        </Menu.Menu>
      </Menu>
  )
}

export default Navbar