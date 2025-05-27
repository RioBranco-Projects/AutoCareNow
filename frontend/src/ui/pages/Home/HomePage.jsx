import styles from './HomePage.module.css'
import {Link} from 'react-router-dom'
import { IoMdFunnel } from "react-icons/io";
import { MdMiscellaneousServices } from "react-icons/md";
import { FaSellsy } from "react-icons/fa";
import { IoPeopleOutline } from "react-icons/io5";
import { MdAttachMoney } from "react-icons/md";
import { GrCube } from "react-icons/gr";
import Card from '../../components/Card.jsx'

export default function Home() {
  return (
  <section className={styles.container}>
      <div className={styles.cards}>
        <Link to="/services">
          <Card nome="Serviços" icone={IoMdFunnel} color="#1A67BF" />
        </Link>
        <Link to="/clients">
          <Card nome="Clientes" icone={IoPeopleOutline} color="#4EB2E7" />
        </Link>
        <Link>
          <Card nome="Configurações" icone={MdMiscellaneousServices} color="#61C1B7" />
        </Link>
        <Link>
          <Card nome="Produtos" icone={GrCube} color="#E75449" />
        </Link>
        <Link>
          <Card nome="Financeiro" icone={MdAttachMoney} color="#6EC401" />
        </Link>
        <Link>
          <Card nome="Feedbacks" icone={FaSellsy} color="#F09A23"/>
        </Link>
      </div>
    </section>
  )
}
