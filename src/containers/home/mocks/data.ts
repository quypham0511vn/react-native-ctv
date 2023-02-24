import { HistoryPaymentModel } from '@/models/history';
import { ItemProps } from '@/components/BottomSheet';
import { ItemPickerProps } from '@/components/PickerBottomBase';
import { UserInfoModel } from '@/models/user-model';
import { ItemPropsModel } from '@/models/common';
import { COLORS } from '@/theme';

export const InsuranceData = [
    {
        id: 0,
        name: 'BẢO HIỂM QUÂN ĐỘI MIC'
        // image: LogoMic
    },
    {
        id: 1,
        name: 'BẢO HIỂM SỨC KHỎE VBI'
        // image: LogoVbi
    },
    {
        id: 2,
        name: 'BẢO HIỂM TOÀN CẦU GIC'
        // image: LogoGic
    }
];

export const NewsData = [
    {
        id: 0,
        name: 'CTKM Tháng 4 | Miễn giảm 100% lãi suất 3 tháng!',
        date: '03/04/2021'
    },
    {
        id: 1,
        name: 'CTKM Tháng 4 | Miễn giảm 100% lãi suất 3 tháng!',
        date: '03/04/2021'
    },
    {
        id: 2,
        name: 'CTKM Tháng 4 | Miễn giảm 100% lãi suất 3 tháng!',
        date: '03/04/2021'
    },
    {
        id: 3,
        name: 'CTKM Tháng 4 | Miễn giảm 100% lãi suất 3 tháng!',
        date: '03/04/2021'
    }
];

export const HistoryData = [
    {
        id: 0,
        title: 'Tháng 5',
        month: [
            {
                id: 11,
                name: 'HĐCC/ĐKXM/HN26VP/2005/38',
                status: 'Thành công',
                timeCreate: '09:06 - 09/04/2021',
                price: '-3.000.000đ',
                // image_avatar: '@/assets/images/contract.png',
                check_status: '1',
                color: COLORS.GREEN
            },
            {
                id: 22,
                name: 'BẢO HIỂM Bảo hiểm VBI',
                status: 'Thành công',
                timeCreate: '09:06 - 09/04/2021',
                price: '-1.000.000đ',
                // image_avatar: '@/assets/images/insurance.png',
                check_status: '1',
                color: COLORS.GREEN
            },
            {
                id: 33,
                name: 'Hóa đơn nước',
                status: 'Thất bại',
                timeCreate: '09:06 - 09/04/2021',
                price: '-400.000đ',
                // image_avatar: '@/assets/images/water.png',
                check_status: '2',
                color: COLORS.RED
            }

        ]
    },
    {
        id: 1,
        title: 'Tháng 4',
        month: [
            {
                id: 44,
                name: 'Hóa đơn nước',
                status: 'Thất bại',
                timeCreate: '09:06 - 09/04/2021',
                price: '-400.000đ',
                // image_avatar: '@/assets/images/water.png',
                check_status: '2',
                color: COLORS.RED
            },
            {
                id: 55,
                name: 'BẢO HIỂM Bảo hiểm VBI',
                status: 'Thành công',
                timeCreate: '09:06 - 09/04/2021',
                price: '-1.000.000đ',
                // image_avatar: '@/assets/images/insurance.png',
                check_status: '1',
                color: COLORS.GREEN
            },
            {
                id: 66,
                name: 'HĐCC/ĐKXM/HN26VP/2005/38',
                status: 'Thành công',
                timeCreate: '09:06 - 09/04/2021',
                price: '-3.000.000đ',
                // image_avatar: '@/assets/images/contract.png',
                check_status: '1',
                color: COLORS.GREEN

            }
        ]

    }
];

export const detaisHistoryData = {
    id: 0,
    services: 'Thanh toán kỳ hợp đồng',
    name: 'CTKM Tháng 4 | Miễn giảm 100% lãi suất 3 tháng!',
    username: '',
    date: '03/04/2021',
    price: '3.000.000đ'
};


export const ListNotify = [
    {
        id: 0,
        title: 'HỢP ĐỒNG',
        status: 'Phê duyệt thành công!',
        description: 'Hợp đồng 000621 đã được hội sở phê duyệt thành công.',
        datecreatat: '2021/05/17 11:41:39',
        image: '',
        unread: '1'
    },
    {
        id: 1,
        title: 'BẢO HIỂM',
        status: 'Thanh toán bảo hiểm thành công!',
        description: 'Bảo hiểm VBI - Sốt xuất huyết cá nhân gói vàng đã được thanh toán 450.000đ thành công.',
        datecreatat: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    },
    {
        id: 2,
        title: 'THANH TOÁN',
        status: 'Hóa đơn điện đã quá 7 ngày chưa thanh toán?',
        description: 'Đã quá 7 ngày bạn chưa thanh toán hóa đơn Điện lực miền Bắc, số hợp đồng PA00CPCP000111, số tiền: 100.000đ.',
        datecreatat: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    },
    {
        id: 3,
        title: 'HỢP ĐỒNG',
        status: 'Phê duyệt thành công!',
        description: 'Hợp đồng 000621 đã được hội sở phê duyệt thành công.',
        datecreatat: '2021/05/17 11:41:39',
        image: '',
        unread: '1'
    },
    {
        id: 4,
        title: 'BẢO HIỂM',
        status: 'Thanh toán bảo hiểm thành công!',
        description: 'Bảo hiểm VBI - Sốt xuất huyết cá nhân gói vàng đã được thanh toán 450.000đ thành công.',
        datecreatat: '2021/05/17 11:41:39',
        image: '',
        unread: '2'
    }
];
export const profileAuth = {
    id: 0,
    nameLogin: '0989999999',
    username: 'NGUYỄN VĂN ABC',
    numberPhone: '0989999999',
    card: '022199000000',
    date: '31/07/2019',
    place: 'CUC CS',
    address: 'TRUNG HÒA, CẦU GIẤY, HÀ NỘI',
    email: 'abcnv@gmail.com'
};
export const dataHistoryPaymentProp = {
    totalPayed: 4000000,
    debtTotal: 8000000,
    finalSettlement: 8500000,
    shouldPay: [
        {
            period: 4,
            datePay: '01/06/2021',
            moneyPayed: 2000000,
            debt: 3000000,
            status: 'false'
        },
        {
            period: 5,
            datePay: '01/07/2021',
            moneyPayed: 2000000,
            debt: 1000000,
            status: 'false'
        },
        {
            period: 6,
            datePay: '01/08/2021',
            moneyPayed: 1000000,
            debt: 1000000,
            status: 'false'
        }
    ],
    payed: [
        {
            period: 1,
            status: 'success'
        },
        {
            period: 2,
            status: 'success'
        },
        {
            period: 3,
            status: 'success'
        }
    ]
};

export const assetTypeData = [
    {
        id: 1,
        value: 'O to'
    },
    {
        id: 2,
        value: 'Xe may'
    },
    {
        id: 3,
        value: 'O to'
    },
    {
        id: 4,
        value: 'O to'
    },
    {
        id: 5,
        value: 'O to'
    },
    {
        id: 6,
        value: 'O to'
    },
    {
        id: 7,
        value: 'O to'
    },
    {
        id: 8,
        value: 'O to'
    },
    {
        id: 9,
        value: 'O to'
    },
    {
        id: 10,
        value: 'O to'
    },
    {
        id: 11,
        value: 'O to'
    }
] as ItemPropsModel[];

export const LoanListArray = [
    {
        id: 1,
        fullName: 'Nguyễn Huyền My',
        phone: '0123456789',
        date: '01/11/2022',
        service: 'Đăng kí xe máy',
        amount: '12,000,000',
        roseAmount: '1,000,000'
    },
    {
        id: 2,
        fullName: 'Nguyễn Huyền My',
        phone: '0123456789',
        date: '01/11/2022',
        service: 'Đăng kí xe máy',
        amount: '12,000,000',
        roseAmount: '1,000,000'
    },
    {
        id: 3,
        fullName: 'Nguyễn Huyền My',
        phone: '0123456789',
        date: '01/11/2022',
        service: 'Đăng kí xe máy',
        amount: '12,000,000',
        roseAmount: '1,000,000'
    }
];
export const HistoryPaymentArray = [
    {
        id: 1,
        bankName: 'VPbank',
        bankNumber: '0123456789',
        bankOwner: 'Nguyễn Huyền My',
        content: 'Công ty Công Nghệ Cổ phần Tài Chính Việt thanh toán tiền giới thiệu Bảo hiểm TNDS xe máy/ô tô của khách hàng Trần Văn Sơn - SĐT: 0321456987Đăng kí xe máy Số tiền 66,000 Tiền hoa hồng 36,000',
        date: '01/11/2022'
    },
    {
        id: 2,
        bankName: 'Viettinbank',
        bankNumber: '11111111',
        bankOwner: 'Cao Huyền Mai',
        content: 'Công ty Công Nghệ Cổ phần Tài Chính Việt thanh toán tiền giới thiệu Bảo hiểm TNDS xe máy/ô tô của khách hàng Trần Văn Sơn - SĐT: 0321456987Đăng kí xe máy Số tiền 66,000 Tiền hoa hồng 36,000',
        date: '02/6/2022'
    },
    {
        id: 3,
        bankName: 'TPbank',
        bankNumber: '22222222',
        bankOwner: 'An Huyền Trang',
        content: 'Công ty Công Nghệ Cổ phần Tài Chính Việt thanh toán tiền giới thiệu Bảo hiểm TNDS xe máy/ô tô của khách hàng Trần Văn Sơn - SĐT: 0321456987Đăng kí xe máy Số tiền 66,000 Tiền hoa hồng 36,000',
        date: '22/1/2022'
    }
];

export const serviceArray = [
    {
        id: 1,
        value: 'Đăng kí xe máy'
    },
    {
        id: 2,
        value: 'Đăng kí ô tô'
    },
    {
        id: 3,
        value: 'Đăng kí nhà'
    }
];

export const BankArray = [
    {
        id: 1,
        value: 'ViettinBank'
    },
    {
        id: 2,
        value: 'VpBank'
    },
    {
        id: 3,
        value: 'TechcomBank'
    },
    {
        id: 4,
        value: 'SacomBank'
    }
];

export const GenderArray = [
    {
        id: 1,
        text: 'Nam',
        value: 'male'
    },
    {
        id: 2,
        text: 'Nữ',
        value: 'female'
    }
];


export const User = {
    type: '1',
    phone_number: '0862319100',
    password: '12345678',
    full_name: 'Bui Xuan Duy',
    email: 'Duybx@tienngay.vn',
    loan_purpose: '1232',
    channels: '',
    created_at: 1,
    status: '1',
    status_login: true,
    token_active: 1,
    timeExpried_active: 1,
    created_by: '',
    token_app: '',
    _id: {},
    indentify: '',
    identify: '',
    role_user: '',
    updated_at: '',
    updated_by: '',
    username: '',
    birth_date: '',
    avatar: '',
    id_fblogin: '',
    id_google: '',
    user_apple: '',
    card_back: '',
    front_facing_card: '',
    portrait: '',
    auth: 1,
    rate: '',
    isAdmin: true
} as UserInfoModel;

export const ReferListArray = [
    [
        {
            id: 1,
            key: 'Họ và tên',
            value: 'Nguyễn Huyền My',
            auth: true
        },
        {
            id: 2,
            value: '0123456789',
            date: 'Số điện thoại',
            auth: true
        },
        {
            id: 3,
            key: 'Thời gian',
            value: '01/11/2022',
            auth: true
        }
    ],
    [
        {
            id: 1,
            key: 'Họ và tên',
            value: 'Nguyễn Huy Tưởng',
            auth: false
        },
        {
            id: 2,
            value: '9876543210',
            date: 'Số điện thoại',
            auth: false
        },
        {
            id: 3,
            key: 'Thời gian',
            value: '01/11/2022',
            auth: false
        }
    ]
];
